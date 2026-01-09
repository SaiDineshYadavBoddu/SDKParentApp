import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
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
import { useGetCardsQuery, useGetTransactionsQuery } from "../../../network/card/card.api";
import { useAuth } from "../../../context/AuthContext";
import CurrencySVG from "../../../assets/svgs/CurrencySVG";
import CustomLoader from "../../../common/components/CustomLoader";
import { useNavigation } from "@react-navigation/native";
import CardCarousel from "../../../common/components/CardCarousel";
import { formatAmount } from "../../../utils/amountUtils";
import { isCardPendingActivation, isCardTempBlocked } from "../../../utils/cardUtils";
import { mapTransactionsToSectionItems, calculateDateRange } from "../../../utils/transactionUtils";
import { MOCK_TRANSACTIONS } from "../../../constants/mockData";
import { APP_CONFIG } from "../../../config/appConfig";


export default function CardListScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navigation = useNavigation<any>();
  const [activeCardIndex, setActiveCardIndex] = React.useState(0);

  const { data, isLoading, error } = useGetCardsQuery({
    cardStatus: [
      'Pending Activation',
      'Active',
      'Dormant',
      'Blocked',
      'Closed',
      'Pending Closure',
    ],
    pageSize: 10,
    pageNumber: 0,
    sortProperty: 'cardholderName',
    sortDirection: 'ASC',
  }, {
    pollingInterval: 30000,
    refetchOnMountOrArgChange: true,
  });

  const cards = data?.content || [];
  const activeCard = cards[activeCardIndex];

  const { data: transactionsData, isLoading: isTxnLoading } = useGetTransactionsQuery({
    cardId: activeCard?.cardIdentifier,
    pageSize: 4,
    pageNumber: 0,
    ...calculateDateRange('lastMonth'),
  }, {
    skip: !activeCard?.cardIdentifier || APP_CONFIG.USE_MOCK_TRANSACTIONS,
  });
  const isPendingActivation = isCardPendingActivation(activeCard?.cardStatus);
  const isTempBlocked = isCardTempBlocked(activeCard?.cardStatus, activeCard?.statusCause);

  const transactions = APP_CONFIG.USE_MOCK_TRANSACTIONS
    ? MOCK_TRANSACTIONS.filter(t => t.cardId === activeCard?.cardIdentifier).slice(0, 4)
    : (transactionsData?.content || []);

  const transactionItems: SectionItem[] = mapTransactionsToSectionItems(transactions);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <BackButtonSVG />
        </TouchableOpacity>
        <CustomText type={TextType.ScreenHeadlineSmall} style={{ fontWeight: '600' }}>
          {t('cardList.title')}
        </CustomText>
        <TouchableOpacity
          onPress={() => {
            // Handle menu
          }}
        >
          <MenuHamburgerSVG />
        </TouchableOpacity>
      </View>
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
              {activeCard?.cardStatus === 'Blocked' ? t('cardList.inactive') : (activeCard?.cardStatus || t('cardList.active'))}
            </CustomText>
          </View>
        )}

        <CardCarousel
          data={cards}
          onIndexChange={(index) => setActiveCardIndex(index)}
        />

        {isPendingActivation ? (
          <View style={styles.activationCard}>
            <CustomText type={TextType.SectionTitle} style={styles.activationTitle}>
              {t('cardList.cardPendingActivation')}
            </CustomText>
            <CustomText type={TextType.CardText} style={styles.activationDescription}>
              {t('cardList.activationInstruction')}
            </CustomText>
            <TouchableOpacity
              style={styles.activateButton}
              onPress={() => navigation.navigate('ActivateCard', { card: activeCard })}
            >
              <CustomText type={TextType.Button} style={styles.activateButtonText}>
                {t('cardList.activateCard')}
              </CustomText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.actionsRow}>
              <ActionButton
                title={t('cardList.manage')}
                icon={<ManageCardSVG />}
                disabled={isTempBlocked}
                onPress={() => {
                  if (activeCard) {
                    navigation.navigate('ManageCard', { card: activeCard })
                  }
                }}
              />

              <ActionButton
                title={t('cardList.replace')}
                icon={<ReplaceCardSVG />}
                disabled={isTempBlocked}
                onPress={() => {
                  if (activeCard) {
                    navigation.navigate('ReplaceCard', { card: activeCard })
                  }
                }}
              />

              <ActionButton
                title={isTempBlocked ? t('cardList.unfreeze') : t('cardList.freeze')}
                icon={<FreezeCardSVG color={isTempBlocked ? '#0066b3' : undefined} />}
                onPress={() => {
                  if (activeCard) {
                    navigation.navigate('FreezeCard', { card: activeCard })
                  }
                }}
              />
            </View>

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
          </>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.xxl,
    paddingHorizontal: Spacing.l,
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
