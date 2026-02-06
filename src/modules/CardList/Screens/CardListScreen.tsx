import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  RefreshControl,
} from "react-native";
import { ms } from "react-native-size-matters";
import SectionContainer, { SectionItem } from "../../../common/components/SectionContainer";
import CustomText, { TextType } from "../../../common/components/CustomText";
import ActionButton from "../../../common/components/ActionButton";
import CustomErrorView from "../../../common/components/CustomErrorView";
import { Spacing } from "../../../theme/spacing";
import InfoSVG from "../../../assets/svgs/InfoSVG";
import ReplaceCardSVG from "../../../assets/svgs/ReplaceCardSVG";
import FreezeCardSVG from "../../../assets/svgs/FreezeCardSVG";
import UnFreezeSVG from "../../../assets/svgs/UnFreezeSVG";
import ManageCardSVG from "../../../assets/svgs/ManageCardSVG";
import NotificationSVG from "../../../assets/svgs/NotificationSVG";
import SuccessSVG from "../../../assets/svgs/SuccessSVG";
import FailureSVG from "../../../assets/svgs/FailureSVG";
import { useGetCardsQuery, useGetTransactionsQuery, useUnblockCardMutation, useActivateCardMutation } from "../../../network/card/card.api";
import { useSecondaryAuth } from "../../../hooks/useSecondaryAuth";
import CurrencySVG from "../../../assets/svgs/CurrencySVG";
import CustomLoader from "../../../common/components/CustomLoader";
import RequestTimeoutScreen from "../../../common/components/RequestTimeoutScreen";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import CardCarousel from "../../../common/components/CardCarousel";
import { formatAmount } from "../../../utils/amountUtils";
import { useRoute } from "@react-navigation/native";
import {
  isCardPendingActivation,
  isCardTempBlocked,
  isCardBlocked,
  isCardReplaced,
  isCardPendingClosure,
  canBlockCard,
  canUnblockCard,
  canReplaceCard,
  shouldShowTransactions,
  shouldShowManageCard,
  hasResourceAction
} from "../../../utils/cardUtils";
import { mapTransactionsToSectionItems, calculateDateRange } from "../../../utils/transactionUtils";
import { MOCK_TRANSACTIONS } from "../../../constants/mockData";
import CustomHeader from '../../../common/components/CustomHeader';
import ConfirmationBottomSheet from '../../../common/components/ConfirmationBottomSheet';
import { APP_CONFIG } from "../../../config/appConfig";
import { useTheme } from '../../../theme/ThemeProvider';


const CARD_QUERY_PARAMS = {
  pageSize: 10,
  pageNumber: 0,
  sortProperty: 'cardholderName',
  sortDirection: 'ASC',
};

export default function CardListScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const [activeCardId, setActiveCardId] = React.useState<string | null>(route.params?.cardId || null);
  const isInitializing = React.useRef(true);
  const [isUnblockSuccess, setIsUnblockSuccess] = React.useState(false);
  const [showUnblockConfirm, setShowUnblockConfirm] = React.useState(false);
  const [isManualRefresh, setIsManualRefresh] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState<{
    visible: boolean;
    title: string;
    message: string;
    confirmText: string;
    icon?: React.ReactNode;
    onConfirm: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    confirmText: '',
    onConfirm: () => { },
  });

  const { data, isLoading, refetch, isError, isFetching, error } = useGetCardsQuery(CARD_QUERY_PARAMS, {
    refetchOnMountOrArgChange: true,
  });

  const onRefresh = React.useCallback(async () => {
    setIsManualRefresh(true);
    await refetch();
    setIsManualRefresh(false);
  }, [refetch]);

  const cards = data?.content || [];

  // Derive active index from ID
  const activeCardIndex = React.useMemo(() => {
    if (!activeCardId || cards.length === 0) return 0;
    const targetId = String(activeCardId);
    const index = cards.findIndex((c: any) =>
      String(c.cardIdentifier) === targetId ||
      String(c.maskedPan) === targetId ||
      String(c.id) === targetId
    );
    return index !== -1 ? index : 0;
  }, [cards, activeCardId]);

  // Handle initial focus and navigation params
  React.useEffect(() => {
    const paramCardId = route.params?.cardId;
    if (cards.length > 0) {
      if (paramCardId) {
        const targetId = String(paramCardId);
        console.log('🔍 CardList Matching Debug:', {
          targetId,
          cardsInList: cards.map((c: any) => ({
            id: c.id,
            cardIdentifier: c.cardIdentifier,
            maskedPan: c.maskedPan
          }))
        });

        // Always try to set active card ID from params if it's there
        if (String(activeCardId) !== targetId) {
          setActiveCardId(paramCardId);
          isInitializing.current = true;
        }

        // Only clear the param once we've successfully found it in the list
        const foundIndex = cards.findIndex((c: any) => {
          const match = String(c.cardIdentifier) === targetId ||
            String(c.maskedPan) === targetId ||
            String(c.id) === targetId;

          if (match) console.log('✅ Found Match at index:', cards.indexOf(c));
          return match;
        });

        if (foundIndex !== -1) {
          // Clear param to avoid fighting with manual swipes later
          navigation.setParams({ cardId: undefined });
        } else {
          // If not found, show error and clear param
          console.log('❌ No match found for targetId:', targetId);
          // Small delay to ensure navigation transition is complete
          setTimeout(() => {
            setAlertConfig({
              visible: true,
              title: t('cardList.cardNotFoundTitle'),
              message: t('cardList.cardNotFoundMessage'),
              confirmText: t('common.ok'),
              icon: <FailureSVG width={ms(64)} height={ms(64)} />,
              onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
            });
          }, 200);
          navigation.setParams({ cardId: undefined });
        }
      } else if (!activeCardId) {
        // Initial load default
        setActiveCardId(cards[0].cardIdentifier);
      }
    }
  }, [route.params?.cardId, cards.length, activeCardId]);

  // Separate effect to handle the initialization lock to prevent it from being stuck
  // due to dependency-triggered re-renders clearing the timer.
  React.useEffect(() => {
    if (isInitializing.current) {
      const timer = setTimeout(() => {
        isInitializing.current = false;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeCardId]);

  const [unblockCard, { isLoading: isUnblocking }] = useUnblockCardMutation();
  const [activateCard, { isLoading: isActivating }] = useActivateCardMutation(); // Added activateCard mutation

  const { startAuthFlow } = useSecondaryAuth(); // Added useSecondaryAuth hook

  const activeCard = cards[activeCardIndex];

  const dateRange = React.useMemo(() => calculateDateRange('thisMonth'), []);

  const { data: transactionsData, isLoading: isTxnLoading } = useGetTransactionsQuery({
    cardId: activeCard?.cardIdentifier,
    pageSize: 4,
    pageNumber: 0,
    ...dateRange,
  }, {
    // skip: isLoading || !activeCard?.cardIdentifier
    skip: true
  });
  // Card status checks
  const isBlocked = isCardBlocked(activeCard?.cardStatus);
  const isPendingActivation = isCardPendingActivation(activeCard?.cardStatus);
  const isTempBlocked = isCardTempBlocked(activeCard?.cardStatus, activeCard?.statusCause);
  const isReplaced = isCardReplaced(activeCard?.cardStatus);
  const isPendingClosure = isCardPendingClosure(activeCard?.cardStatus);

  // App-defined permission checks based on card status
  const canBlock = canBlockCard(activeCard?.cardStatus);
  const canUnblock = canUnblockCard(activeCard?.cardStatus, activeCard?.statusCause);
  const canReplace = canReplaceCard(activeCard?.cardStatus, activeCard?.statusCause);

  // UI visibility flags
  const showManageCard = shouldShowManageCard(activeCard?.cardStatus);
  const showReplaceCard = canReplace && !isReplaced && !isPendingClosure;
  const showBlockButton = (canBlock || canUnblock) && !isReplaced && !isPendingClosure;
  const showTransactions = shouldShowTransactions(activeCard?.cardStatus);

  // const transactions = APP_CONFIG.USE_MOCK_TRANSACTIONS
  // ? MOCK_TRANSACTIONS.filter(t => t.cardId === activeCard?.cardIdentifier).slice(0, 4)
  // : (transactionsData?.content || []);

  const transactions: any[] = []; // Show empty message for now

  const transactionItems: SectionItem[] = mapTransactionsToSectionItems(transactions, colors.secondaryText);

  // Handlers for card activation using secondary auth
  const handleActivationSuccess = async (actionToken: string) => {
    try {
      await activateCard({ cardId: activeCard.cardIdentifier, actionToken }).unwrap();
      navigation.reset({
        index: 1,
        routes: [
          {
            name: 'BottomTabs',
            params: {
              screen: 'My Cards',
              params: { cardId: activeCard.cardIdentifier },
              cardId: activeCard.cardIdentifier
            }
          },
          {
            name: 'GenericInfoScreen',
            params: {
              icon: <SuccessSVG />,
              title: 'activateCard.successTitle',
              description: 'activateCard.successSubtitle',
              primaryButton: {
                title: 'common.done',
                onPress: () => navigation.reset({
                  index: 0,
                  routes: [{
                    name: 'BottomTabs',
                    params: {
                      screen: 'My Cards',
                      params: { cardId: activeCard.cardIdentifier },
                      cardId: activeCard.cardIdentifier,
                    },
                  }],
                }),
              },
            }
          }
        ],
      });
    } catch (err: any) {
      console.error('Failed to activate card:', err);
      navigation.reset({
        index: 1,
        routes: [
          {
            name: 'BottomTabs',
            params: {
              screen: 'My Cards',
              params: { cardId: activeCard.cardIdentifier },
              cardId: activeCard.cardIdentifier
            }
          },
          {
            name: 'GenericInfoScreen',
            params: {
              icon: <FailureSVG />,
              title: 'activateCard.errorTitle',
              description: 'activateCard.errorSubtitle',
              primaryButton: {
                title: 'common.done',
                onPress: () => navigation.reset({
                  index: 0,
                  routes: [{
                    name: 'BottomTabs',
                    params: {
                      screen: 'My Cards',
                      params: { cardId: activeCard.cardIdentifier },
                      cardId: activeCard.cardIdentifier,
                    },
                  }],
                }),
              },
            }
          }
        ],
      });
    }
  };

  const startSensitiveAction = () => {
    startAuthFlow({
      onSuccess: handleActivationSuccess,
      externalLoading: isActivating,
    });
  };

  const isTimeoutError = (error as any)?.status === 'TIMEOUT_ERROR';



  if (isTimeoutError) {
    return (
      <View style={[styles.mainContainer, { backgroundColor: colors.secondaryScreenBackground }]}>
        <CustomHeader
          title={t('cardList.title')}
        />
        <RequestTimeoutScreen onRetry={refetch} />
        <CustomLoader loading={isFetching} />
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.secondaryScreenBackground }]}>
      <CustomHeader
        title={t('cardList.title')}
        rightContent={
          <TouchableOpacity style={styles.rightButton} onPress={() => { navigation.navigate('Notifications') }}>
            <NotificationSVG width={ms(24)} height={ms(24)} />
          </TouchableOpacity>
        }
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefresh}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {isError && !isFetching ? (
          <CustomErrorView onRetry={refetch} loading={isFetching} />
        ) : (
          <>
            {activeCard && !isLoading && (
              <View style={styles.balanceContainer}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4) }}
                >
                  <CurrencySVG
                    width={ms(18)}
                    height={ms(22)}
                  />
                  {(() => {
                    const { integer, decimal } = formatAmount(activeCard.balance ?? 0);
                    return (
                      <Text>
                        <CustomText type={TextType.ScreenHeadlineLarge}>
                          {integer}
                        </CustomText>
                        <CustomText type={TextType.ScreenHeadlineSmall}>
                          {decimal}
                        </CustomText>
                      </Text>
                    );
                  })()}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.xs,
                    paddingTop: Spacing.m,
                  }}
                >
                  <CustomText type={TextType.ScreenDisplaySmall}>
                    {t('cardList.availableBalance')}
                  </CustomText>
                  <InfoSVG />
                </View>

                <View style={styles.statusIndicator}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: activeCard.cardStatus === 'Active' ? colors.statusResolved : colors.secondaryText }
                    ]}
                  />
                  <CustomText type={TextType.ScreenDisplaySmall} style={[styles.statusText, { color: colors.secondaryText }]}>
                    {activeCard.cardStatus}
                  </CustomText>
                </View>
              </View>
            )}

            <CardCarousel
              data={cards}
              onIndexChange={(index) => {
                if (cards[index]) {
                  const newId = cards[index].cardIdentifier;
                  if (newId !== activeCardId) {
                    setActiveCardId(newId);
                  }
                }
              }}
              selectedIndex={activeCardIndex}
              showEyeIcon={true}
            />

            {activeCard && !isLoading && (
              <>
                {/* Action buttons - always show but disable based on status */}
                <View style={styles.actionsRow}>
                  <ActionButton
                    title={t('cardList.manage')}
                    icon={<ManageCardSVG />}
                    disabled={!showManageCard}
                    onPress={() => {
                      if (activeCard) {
                        navigation.navigate('ManageCard', { card: activeCard })
                      }
                    }}
                  />

                  <ActionButton
                    title={t('cardList.replace')}
                    icon={<ReplaceCardSVG />}
                    disabled={!showReplaceCard}
                    onPress={() => {
                      if (activeCard) {
                        navigation.navigate('ReplaceCard', { card: activeCard })
                      }
                    }}
                  />

                  <ActionButton
                    title={isBlocked ? t('cardList.unfreeze') : t('cardList.freeze')}
                    icon={isBlocked ? <UnFreezeSVG color={canUnblock ? colors.primary : undefined} /> : <FreezeCardSVG />}
                    disabled={!showBlockButton}
                    onPress={() => {
                      if (activeCard) {
                        if (canUnblock) {
                          setShowUnblockConfirm(true);
                        } else if (canBlock) {
                          navigation.navigate('FreezeCard', { card: activeCard })
                        }
                      }
                    }}
                  />
                </View>

                {isPendingActivation && (
                  <View style={[styles.activationCard, { backgroundColor: colors.surface }]}>
                    <CustomText type={TextType.SectionTitle} style={styles.activationTitle}>
                      {t('cardList.cardPendingActivation')}
                    </CustomText>
                    <CustomText type={TextType.CardText} style={[styles.activationDescription, { color: colors.secondaryText }]}>
                      {t('cardList.activationInstruction')}
                    </CustomText>
                    {(() => {
                      const isActivateEnabled = hasResourceAction(activeCard, 'card-mine', 'activate');
                      return (
                        <TouchableOpacity
                          style={[
                            styles.activateButton,
                            { backgroundColor: colors.primary },
                            (isActivating || !isActivateEnabled) && { opacity: 0.5 }
                          ]}
                          onPress={async () => {
                            if (activeCard) {
                              if (isActivateEnabled) {
                                startSensitiveAction();
                              } else {
                                setAlertConfig({
                                  visible: true,
                                  title: t('common.alert'),
                                  message: "This card can be activated after production. Please try later",
                                  confirmText: t('common.close'),
                                  onConfirm: () => setAlertConfig(prev => ({ ...prev, visible: false })),
                                });
                              }
                            }
                          }}
                          disabled={isActivating}
                        >
                          <CustomText type={TextType.Button} style={[styles.activateButtonText, { color: colors.onPrimary }]}>
                            {t('cardList.activateCard')}
                          </CustomText>
                        </TouchableOpacity>
                      );
                    })()}
                  </View>
                )}
              </>
            )}

            {/* Transactions - show for all except pending activation */}
            {activeCard && !isLoading && showTransactions && (
              <View style={styles.transactionContainer}>
                <SectionContainer
                  title={t('cardList.recentTransactions')}
                  rightTitle={t('cardList.viewAll')}
                  onRightTitlePress={() => { }}
                  items={transactionItems}
                  emptyMessage={t('cardList.noTransactions')}
                  loading={isTxnLoading}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
      <CustomLoader loading={isFocused && (isLoading || (isFetching && !isManualRefresh)) && !alertConfig.visible && !showUnblockConfirm && !isActivating} />

      <ConfirmationBottomSheet
        visible={showUnblockConfirm}
        onClose={() => setShowUnblockConfirm(false)}
        title={t('unblockCard.confirmTitle')}
        message={t('unblockCard.confirmMessage')}
        cancelText={t('common.cancel')}
        confirmText={t('common.confirm')}
        isLoading={isUnblocking}
        onConfirm={async () => {
          if (activeCard) {
            try {
              await unblockCard({ cardId: activeCard.cardIdentifier }).unwrap();
              setShowUnblockConfirm(false);
              refetch();
              navigation.reset({
                index: 1,
                routes: [
                  {
                    name: 'BottomTabs',
                    params: {
                      screen: 'My Cards',
                      params: { cardId: activeCard.cardIdentifier },
                      cardId: activeCard.cardIdentifier
                    }
                  },
                  {
                    name: 'GenericInfoScreen',
                    params: {
                      icon: <SuccessSVG />,
                      title: 'unblockCard.successTitle',
                      description: 'unblockCard.successSubtitle',
                      primaryButton: {
                        title: 'common.done',
                        onPress: () => navigation.reset({
                          index: 0,
                          routes: [{
                            name: 'BottomTabs',
                            params: {
                              screen: 'My Cards',
                              params: { cardId: activeCard.cardIdentifier },
                              cardId: activeCard.cardIdentifier,
                            },
                          }],
                        }),
                      },
                    }
                  }
                ],
              });
            } catch (err: any) {
              console.error('Failed to unblock card:', err);
              setShowUnblockConfirm(false);
              navigation.reset({
                index: 1,
                routes: [
                  {
                    name: 'BottomTabs',
                    params: {
                      screen: 'My Cards',
                      params: { cardId: activeCard.cardIdentifier },
                      cardId: activeCard.cardIdentifier
                    }
                  },
                  {
                    name: 'GenericInfoScreen',
                    params: {
                      icon: <FailureSVG />,
                      title: 'unblockCard.errorTitle',
                      description: 'unblockCard.errorSubtitle',
                      primaryButton: {
                        title: 'common.tryAgain',
                        onPress: () => navigation.reset({
                          index: 0,
                          routes: [{
                            name: 'BottomTabs',
                            params: {
                              screen: 'My Cards',
                              params: { cardId: activeCard.cardIdentifier },
                              cardId: activeCard.cardIdentifier,
                            },
                          }],
                        }),
                      },
                    }
                  }
                ],
              });
            }
          }
        }}
      />

      <ConfirmationBottomSheet
        visible={alertConfig.visible}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        icon={alertConfig.icon}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    paddingBottom: Spacing.xxl,
  },
  rightButton: {
    padding: ms(6),
    marginRight: -ms(6),
  },
  balanceContainer: {
    marginBottom: Spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.l,
  },

  actionsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    justifyContent: 'center',
    paddingHorizontal: Spacing.l,
    gap: Spacing.l,
  },

  transactionContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xxl,
  },

  activationCard: {
    marginHorizontal: Spacing.l,
    padding: Spacing.xl,
    borderRadius: ms(20),
    alignItems: 'center',
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  activationTitle: {
    marginBottom: Spacing.s,
    textAlign: 'center',
  },

  activationDescription: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.m,
  },

  activateButton: {
    paddingVertical: ms(14),
    paddingHorizontal: ms(24),
    borderRadius: ms(10),
    width: '100%',
    alignItems: 'center',
  },

  activateButtonText: {
    fontWeight: '600',
  },

  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(6),
    marginTop: Spacing.xs,
  },
  statusDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  statusText: {
    fontSize: ms(14),
  },
});
