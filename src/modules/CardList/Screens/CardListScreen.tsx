import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import SectionContainer, {
  SectionItem,
} from '../../../common/components/SectionContainer';
import CustomText, { TextType } from '../../../common/components/CustomText';
import ActionButton from '../../../common/components/ActionButton';
import CustomIcon from '../../../common/components/CustomIcon';
import { Spacing } from '../../../theme/spacing';
import InfoSVG from '../../../assets/svgs/InfoSVG';
import ReplaceCardSVG from '../../../assets/svgs/ReplaceCardSVG';
import FreezeCardSVG from '../../../assets/svgs/FreezeCardSVG';
import ManageCardSVG from '../../../assets/svgs/ManageCardSVG';
import NotificationSVG from '../../../assets/svgs/NotificationSVG';
import { useGetCardsQuery } from '../../../network/card/card.api';
import { useAuth } from '../../../context/AuthContext';
import CurrencySVG from '../../../assets/svgs/CurrencySVG';
import CustomLoader from '../../../common/components/CustomLoader';
import { useNavigation } from '@react-navigation/native';
import CardCarousel from '../../../common/components/CardCarousel';
import { formatAmount } from '../../../utils/amountUtils';
import { MOCK_TRANSACTIONS } from '../../../constants/mockData';

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
  });

  const transactionItems: SectionItem[] = MOCK_TRANSACTIONS.map(txn => ({
    id: txn.id,

    top: (
      <>
        <CustomText type={TextType.CardTitle}>{txn.title}</CustomText>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: ms(4) }}
        >
          <CurrencySVG width={ms(14)} height={ms(14)} />
          <CustomText type={TextType.CardTitle}>{txn.amount}</CustomText>
        </View>
      </>
    ),

    middle: (
      <>
        <CustomText type={TextType.CardSubtitle}>{txn.txnId}</CustomText>

        <CustomText type={TextType.CardSubtitle}>{txn.date}</CustomText>
      </>
    ),

    onPress: () => {},
  }));

  return (
    <>
      <View style={styles.header}>
        <CustomText type={TextType.ScreenHeadlineSmall}>
          {t('cardList.title')}
        </CustomText>
        <View style={{ paddingTop: ms(10) }}>
          <TouchableOpacity
            onPress={() => {
              signOut();
            }}
          >
            <NotificationSVG />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
              const { integer, decimal } = formatAmount('50,250.77');
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

          <CustomText type={TextType.ScreenDisplaySmall}>
            {t('cardList.active')}
          </CustomText>
        </View>

        <CardCarousel
          data={data?.content || []}
          onIndexChange={index => setActiveCardIndex(index)}
        />

        <View style={styles.actionsRow}>
          <ActionButton
            title={t('cardList.manage')}
            icon={<ManageCardSVG />}
            onPress={() => {
              if (data?.content && data.content[activeCardIndex]) {
                navigation.navigate('ManageCard', {
                  card: data.content[activeCardIndex],
                });
              }
            }}
          />

          <ActionButton
            title={t('cardList.replace')}
            icon={<ReplaceCardSVG />}
            onPress={() => {
              navigation.navigate('ReplaceCard');
            }}
          />

          <ActionButton
            title={t('cardList.freeze')}
            icon={<FreezeCardSVG />}
            onPress={() => {}}
          />
        </View>

        <View style={styles.transactionContainer}>
          <SectionContainer
            title={t('cardList.recentTransactions')}
            rightTitle={t('cardList.viewAll')}
            onRightTitlePress={() => {}}
            items={transactionItems}
          />
        </View>
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
});
