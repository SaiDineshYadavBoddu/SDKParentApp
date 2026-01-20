import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomImage from '../../../common/components/CustomImage';
import NotificationSVG from '../../../assets/svgs/NotificationSVG';
import SearchSVG from '../../../assets/svgs/SearchSVG';
import ChevronSVG from '../../../assets/svgs/ChevronSVG';
import StatementDownloadSVG from '../../../assets/svgs/StatementDownloadSVG';
import { TIME_RANGES } from '../../../constants/appConstants';
import {
  formatTransactionDate,
  filterTransactions,
  sortTransactions,
  calculateDateRange,
} from '../../../utils/transactionUtils';
import CardSelectionBottomSheet from '../Components/CardSelectionBottomSheet';
import { useGetTransactionsQuery } from '../../../network/card/card.api';
import CustomLoader from '../../../common/components/CustomLoader';
import CustomDatePicker from '../../../common/components/CustomDatePicker';
import CustomChip from '../../../common/components/CustomChip';
import { useSelector } from 'react-redux';


const TransactionsScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [isCardSheetVisible, setCardSheetVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const cardsData = useSelector((state: any) => state.card?.cards);
  const cards = useMemo(() => cardsData?.content || [], [cardsData?.content]);

  const [selectedCardId, setSelectedCardId] = useState<string>('');

  React.useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].cardIdentifier);
    }
  }, [cards, selectedCardId]);

  const selectedCard = useMemo(
    () => cards.find((c: any) => c.cardIdentifier === selectedCardId),
    [cards, selectedCardId]
  );

  const dateRange = useMemo(
    () => calculateDateRange(selectedTimeRange, customDateRange),
    [selectedTimeRange, customDateRange]
  );

  const { data: txnData, isLoading: isTxnLoading } = useGetTransactionsQuery({
    cardId: selectedCardId,
    pageSize: 20,
    pageNumber: 0,
    ...dateRange,
  }, {
    skip: !selectedCardId,
  });

  const transactions = useMemo(() => {
    return txnData?.content || [];
  }, [txnData]);

  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, searchQuery);
    return sortTransactions(filtered, 'newest');
  }, [transactions, searchQuery]);

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View style={styles.txnLeft}>
        <CustomText type={TextType.CardTitle} style={styles.txnTitle}>
          {item.merchantName || item.description}
        </CustomText>
        <CustomText type={TextType.CardSubtitle} style={styles.txnId}>{item.transactionRefId}</CustomText>
      </View>
      <View style={styles.txnRight}>
        <CustomText
          type={TextType.CardTitle}
          style={[styles.txnAmount, { color: item.isCredit ? '#28A745' : colors.onSurface }]}
        >
          {item.isCredit ? `+ ${item.amount}` : item.amount}
        </CustomText>
        <CustomText type={TextType.CardSubtitle} style={styles.txnDate}>
          {formatTransactionDate(item.transactionDate)}
        </CustomText>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <CustomText type={TextType.ScreenHeadlineSmall}>{t('transactions.title')}</CustomText>
        <TouchableOpacity style={styles.iconButton}>
          <NotificationSVG width={ms(24)} height={ms(24)} color={colors.onSurface} stroke={colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Card Selector */}
        <TouchableOpacity
          style={[styles.cardSelector, { borderColor: colors.outline }]}
          onPress={() => setCardSheetVisible(true)}
        >
          <View style={styles.cardSelectorLeft}>
            <CustomImage
              source={require('../../../assets/images/SmallCard.png')}
              style={{ width: ms(34), height: ms(24), marginRight: Spacing.m }}
              resizeMode="contain"
            />
            <CustomText type={TextType.CardTitle}>{selectedCard?.maskedPan}</CustomText>
          </View>
          <ChevronSVG width={ms(20)} height={ms(20)} color={colors.primary} />
        </TouchableOpacity>

        {/* Search and Filters */}
        <View style={styles.searchRow}>
          <View style={[styles.searchBar, { borderColor: colors.outline }]}>
            <SearchSVG width={ms(20)} height={ms(20)} color={colors.textColorDisabled} style={styles.searchIcon} />
            <TextInput
              placeholder={t('transactions.searchPlaceholder')}
              placeholderTextColor={colors.textColorDisabled}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, { color: colors.onSurface }]}
            />
          </View>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => {
              navigation.navigate('Statement');
            }}
          >
            <StatementDownloadSVG width={ms(48)} height={ms(48)} />
          </TouchableOpacity>
        </View>

        {/* Time chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeRangeScroll}
          contentContainerStyle={styles.timeRangeContent}
        >
          {TIME_RANGES.map((range) => (
            <CustomChip
              key={range}
              label={t(`transactions.timeRanges.${range}`)}
              selected={selectedTimeRange === range}
              onPress={() => {
                if (range === 'custom') {
                  setDatePickerVisible(true);
                } else {
                  setSelectedTimeRange(range);
                }
              }}
            />
          ))}
        </ScrollView>

        {/* Transaction List */}
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.transactionRefId}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <CustomText type={TextType.CardSubtitle}>No transactions found</CustomText>
            </View>
          }
        />
      </ScrollView>

      {/* Bottom Sheets */}
      <CardSelectionBottomSheet
        visible={isCardSheetVisible}
        onClose={() => setCardSheetVisible(false)}
        cards={cards}
        selectedCardId={selectedCardId}
        onSelect={setSelectedCardId}
      />
      <CustomDatePicker
        visible={isDatePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onApply={(start, end) => {
          setCustomDateRange({ start, end });
          setSelectedTimeRange('custom');
          setDatePickerVisible(false);
        }}
        initialStartDate={customDateRange.start}
        initialEndDate={customDateRange.end}
      />
      <CustomLoader loading={isTxnLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
  },
  iconButton: {
    padding: ms(4),
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xxl,
  },
  cardSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.m,
    borderWidth: 1,
    borderRadius: ms(12),
    marginBottom: Spacing.l,
    marginTop: Spacing.s,
  },
  cardSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    marginBottom: Spacing.l,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: ms(8),
    height: ms(48),
    paddingHorizontal: Spacing.m,
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: ms(14),
    paddingVertical: 0,
  },
  actionButton: {
    width: ms(48),
    height: ms(48),
    borderWidth: 1,
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadButton: {
    width: ms(48),
    height: ms(48),
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRangeScroll: {
    marginBottom: Spacing.l,
  },
  timeRangeContent: {
    gap: Spacing.s,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  txnLeft: {
    flex: 1,
  },
  txnRight: {
    alignItems: 'flex-end',
  },
  txnTitle: {
    marginBottom: ms(2),
  },
  txnId: {
    fontSize: ms(11),
  },
  txnAmount: {
    marginBottom: ms(2),
  },
  txnDate: {
    fontSize: ms(11),
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: ms(40),
  },
});

export default TransactionsScreen;

