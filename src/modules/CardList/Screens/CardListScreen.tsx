import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import { ms } from "react-native-size-matters";
import SectionContainer, { SectionItem } from "../../../common/components/SectionContainer";
import CustomText, { TextType } from "../../../common/components/CustomText";
import ActionButton from "../../../common/components/ActionButton";
import { Spacing } from "../../../theme/spacing";
import InfoSVG from "../../../assets/svgs/InfoSVG";
import ReplaceCardSVG from "../../../assets/svgs/ReplaceCardSVG";
import FreezeCardSVG from "../../../assets/svgs/FreezeCardSVG";
import ManageCardSVG from "../../../assets/svgs/ManageCardSVG";
import NotificationSVG from "../../../assets/svgs/NotificationSVG";
import BackButtonSVG from "../../../assets/svgs/BackButtonSVG";
import MenuHamburgerSVG from "../../../assets/svgs/MenuHamburgerSVG";
import { useGetCardsQuery, useGetTransactionsQuery, useUnblockCardMutation, useActivateCardMutation } from "../../../network/card/card.api";
import { useAuth } from "../../../context/AuthContext";
import { useSecondaryAuth } from "../../../hooks/useSecondaryAuth";
import CurrencySVG from "../../../assets/svgs/CurrencySVG";
import CustomLoader from "../../../common/components/CustomLoader";
import { useNavigation } from "@react-navigation/native";
import CardCarousel from "../../../common/components/CardCarousel";
import { formatAmount } from "../../../utils/amountUtils";
import {
  isCardPendingActivation,
  isCardTempBlocked,
  isCardReplaced,
  isCardPendingClosure,
  canBlockCard,
  canUnblockCard,
  canReplaceCard,
  shouldShowTransactions,
  shouldShowManageCard
} from "../../../utils/cardUtils";
import { mapTransactionsToSectionItems, calculateDateRange } from "../../../utils/transactionUtils";
import { MOCK_TRANSACTIONS } from "../../../constants/mockData";
import CustomImage from '../../../common/components/CustomImage';
import CustomHeader from '../../../common/components/CustomHeader';
import { APP_CONFIG } from "../../../config/appConfig";


const CARD_QUERY_PARAMS = {
  pageSize: 10,
  pageNumber: 0,
  sortProperty: 'cardholderName',
  sortDirection: 'ASC',
};

export default function CardListScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigation = useNavigation<any>();
  const [activeCardIndex, setActiveCardIndex] = React.useState(0);

  const { data, isLoading, error, refetch } = useGetCardsQuery(CARD_QUERY_PARAMS, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });

  const [unblockCard, { isLoading: isUnblocking }] = useUnblockCardMutation();
  const [activateCard, { isLoading: isActivating }] = useActivateCardMutation(); // Added activateCard mutation

  const { startAuthFlow } = useSecondaryAuth(); // Added useSecondaryAuth hook

  const cards = data?.content || [];
  const activeCard = cards[activeCardIndex];

  const dateRange = React.useMemo(() => calculateDateRange('thisMonth'), []);

  const { data: transactionsData, isLoading: isTxnLoading } = useGetTransactionsQuery({
    cardId: activeCard?.cardIdentifier,
    pageSize: 4,
    pageNumber: 0,
    ...dateRange,
  }, {
    skip: isLoading || !activeCard?.cardIdentifier
  });
  // Card status checks
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

  const transactions = APP_CONFIG.USE_MOCK_TRANSACTIONS
    ? MOCK_TRANSACTIONS.filter(t => t.cardId === activeCard?.cardIdentifier).slice(0, 4)
    : (transactionsData?.content || []);

  const transactionItems: SectionItem[] = mapTransactionsToSectionItems(transactions);

  // Handlers for card activation using secondary auth
  const handleActivationSuccess = async (actionToken: string) => {
    try {
      await activateCard({ cardId: activeCard.cardIdentifier, actionToken }).unwrap();
      refetch();
      navigation.navigate('BottomTabs');
    } catch (err: any) {
      console.error('Failed to activate card:', err);
      Alert.alert(t('common.error'), err?.data?.errorMessage || t('common.error'));
    }
  };

  const startSensitiveAction = () => {
    startAuthFlow({
      onSuccess: handleActivationSuccess,
      externalLoading: isActivating,
    });
  };

  return (
    <>
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
      >
        {isPendingActivation ? (
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <CustomText type={TextType.ScreenHeadlineSmall} style={styles.statusText}>
              {t('cardList.pendingActivation')}
            </CustomText>
            <InfoSVG width={ms(16)} height={ms(16)} color="#707070" />
          </View>
        ) : (
          <View style={styles.balanceContainer}>
            <View
              style={{ flexDirection: 'row', alignItems: 'baseline', gap: ms(4) }}
            >
              <CurrencySVG
                width={ms(24)}
                height={ms(24)}
                style={{ transform: [{ translateY: ms(4) }] }}
              />
              {(() => {
                const { integer, decimal } = formatAmount(activeCard?.balance?.toString() || '0.00');
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

            <CustomText type={TextType.ScreenDisplaySmall} style={styles.statusText}>
              {activeCard?.cardStatus}
            </CustomText>
          </View>
        )}

        <CardCarousel
          data={cards}
          onIndexChange={(index) => setActiveCardIndex(index)}
        />

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
            title={canUnblock ? t('cardList.unfreeze') : t('cardList.freeze')}
            icon={<FreezeCardSVG color={canUnblock ? '#0066b3' : undefined} />}
            loading={isUnblocking}
            disabled={!showBlockButton}
            onPress={async () => {
              if (activeCard) {
                if (canUnblock) {
                  try {
                    await unblockCard({ cardId: activeCard.cardIdentifier }).unwrap();
                    refetch();
                  } catch (err) {
                    console.error('Failed to unblock card:', err);
                  }
                } else if (canBlock) {
                  navigation.navigate('FreezeCard', { card: activeCard })
                }
              }
            }}
          />
        </View>

        {isPendingActivation && (
          <View style={styles.activationCard}>
            <CustomText type={TextType.SectionTitle} style={styles.activationTitle}>
              {t('cardList.cardPendingActivation')}
            </CustomText>
            <CustomText type={TextType.CardText} style={styles.activationDescription}>
              {t('cardList.activationInstruction')}
            </CustomText>
            <TouchableOpacity
              style={[styles.activateButton, isActivating && { opacity: 0.7 }]}
              onPress={() => {
                if (activeCard) {
                  startSensitiveAction();
                }
              }}
              disabled={isActivating}
            >
              <CustomText type={TextType.Button} style={styles.activateButtonText}>
                {t('cardList.activateCard')}
              </CustomText>
            </TouchableOpacity>
          </View>
        )}

        {/* Transactions - show for all except pending activation */}
        {showTransactions && (
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
      </ScrollView>
      <CustomLoader loading={isLoading} />
    </>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#FFFFFF',
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
    color: '#707070',
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.m,
  },

  activateButton: {
    backgroundColor: '#0066b3',
    paddingVertical: ms(14),
    paddingHorizontal: ms(24),
    borderRadius: ms(10),
    width: '100%',
    alignItems: 'center',
  },

  activateButtonText: {
    color: 'white',
    fontWeight: '600',
  },

  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(6),
    marginBottom: Spacing.l,
    marginTop: Spacing.m,
  },

  statusDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: '#707070',
  },

  statusText: {
    color: '#707070',
    fontSize: ms(14),
  },
});
