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
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms } from 'react-native-size-matters';
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
  getFormattedTransaction,
} from '../../../utils/transactionUtils';
import { formatMaskedCardNumber } from '../../../utils/cardUtils';
import CardSelectionBottomSheet from '../Components/CardSelectionBottomSheet';
import { useGetTransactionsQuery } from '../../../network/card/card.api';
import CustomLoader from '../../../common/components/CustomLoader';
import CustomDatePicker from '../../../common/components/CustomDatePicker';
import CustomChip from '../../../common/components/CustomChip';
import { useSelector } from 'react-redux';
import CustomHeader from '../../../common/components/CustomHeader';
import CustomErrorView from '../../../common/components/CustomErrorView';
import RequestTimeoutScreen from '../../../common/components/RequestTimeoutScreen';


const TransactionsScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialCardId = route.params?.cardId;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('lastMonth');
  const [isCardSheetVisible, setCardSheetVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [pageNumber, setPageNumber] = useState(0);
  const PAGE_SIZE = 20;

  const cardsData = useSelector((state: any) => state.card?.cards);
  const cards = useMemo(() => cardsData?.content || [], [cardsData?.content]);

  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId || '');

  React.useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].cardIdentifier);
    }
  }, [cards, selectedCardId]);

  React.useEffect(() => {
    if (route.params?.cardId) {
      setSelectedCardId(route.params.cardId);
    }
  }, [route.params?.cardId]);

  // Reset page when card or time range changes
  React.useEffect(() => {
    setPageNumber(0);
  }, [selectedCardId, selectedTimeRange, customDateRange]);

  const selectedCard = useMemo(
    () => cards.find((c: any) => c.cardIdentifier === selectedCardId),
    [cards, selectedCardId]
  );

  const dateRange = useMemo(
    () => calculateDateRange(selectedTimeRange, customDateRange),
    [selectedTimeRange, customDateRange]
  );

  const { data: txnData, isLoading: isTxnLoading, isError, refetch, isFetching, error } = useGetTransactionsQuery({
    cardId: selectedCardId,
    pageSize: PAGE_SIZE,
    pageNumber: pageNumber,
    ...dateRange,
  }, {
    skip: !selectedCardId,
  });

  const isTimeoutError = (error as any)?.status === 'TIMEOUT_ERROR';



  if (isError && !isTimeoutError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader
          title={t('transactions.title')}
        />
        <CustomErrorView
          title={t('common.error')}
          description={t('transactions.errorLoading')}
          onRetry={refetch}
        />
        <CustomLoader loading={isFetching} />
      </View>
    );
  }

  if (isTimeoutError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader
          title={t('transactions.title')}
        />
        <RequestTimeoutScreen onRetry={refetch} />
        <CustomLoader loading={isFetching} />
      </View>
    );
  }

  const transactions = useMemo(() => {
    return txnData?.content || [];
  }, [txnData]);

  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, searchQuery);
    return sortTransactions(filtered, 'newest');
  }, [transactions, searchQuery]);

  const handleLoadMore = () => {
    if (!isTxnLoading && !isFetching && txnData && !txnData.last) {
      setPageNumber(prev => prev + 1);
    }
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    const { amountDisplay, color, displayName } = getFormattedTransaction(item, colors);
    return (
      <View style={[styles.transactionItem, { borderBottomColor: colors.outline }]}>
        <View style={styles.txnLeft}>
          <CustomText type={TextType.CardTitle} style={styles.txnTitle}>
            {displayName}
          </CustomText>
          <CustomText type={TextType.CardSubtitle} style={styles.txnId}>{item.transactionRefId}</CustomText>
        </View>
        <View style={styles.txnRight}>
          <CustomText
            type={TextType.CardTitle}
            style={[styles.txnAmount, { color }]}
          >
            {amountDisplay}
          </CustomText>
          <CustomText type={TextType.CardSubtitle} style={styles.txnDate}>
            {formatTransactionDate(item.transactionDate)}
          </CustomText>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <CustomHeader
        title={t('transactions.title')}
        rightContent={
          <TouchableOpacity style={styles.rightButton} onPress={() => { navigation.navigate('Notifications') }}>
            <NotificationSVG width={ms(24)} height={ms(24)} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item, index) => `${item.transactionRefId}-${index}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <>
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
                <CustomText type={TextType.CardTitle}>{formatMaskedCardNumber(selectedCard?.maskedPan)}</CustomText>
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
          </>
        }
        ListEmptyComponent={
          !isTxnLoading && !isFetching ? (
            <View style={styles.emptyContainer}>
              <CustomText type={TextType.CardSubtitle}>No transactions found</CustomText>
            </View>
          ) : null
        }
      />

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
  rightButton: {
    padding: ms(6),
    marginRight: -ms(6),
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
    paddingVertical: Spacing.l,
    borderBottomWidth: 1
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

