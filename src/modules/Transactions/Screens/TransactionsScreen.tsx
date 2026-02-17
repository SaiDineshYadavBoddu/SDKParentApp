import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomImage from '../../../common/components/CustomImage';
import NotificationSVG from '../../../assets/svgs/NotificationSVG';
import SearchSVG from '../../../assets/svgs/SearchSVG';
import CustomTextInput from '../../../common/components/CustomTextInput';
import ChevronSVG from '../../../assets/svgs/ChevronSVG';
import CheveronDownSVG from '../../../assets/svgs/CheveronDownSVG';
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


if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TransactionsScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialCardId = route.params?.cardId;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  console.log("Transaction screen added")

  const [selectedTimeRange, setSelectedTimeRange] = useState('lastMonth');
  const [isCardSheetVisible, setCardSheetVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [pageNumber, setPageNumber] = useState(0);
  const [expandedTxnId, setExpandedTxnId] = useState<string | null>(null);
  const PAGE_SIZE = 20;

  const cardsData = useSelector((state: any) => state.card?.cards);
  const cards = useMemo(() => cardsData?.content || [], [cardsData?.content]);

  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId || '');

  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setDebouncedSearchQuery('');
      setSelectedTimeRange('lastMonth');
      if (cards.length > 0) {
        setSelectedCardId(cards[0].cardIdentifier);
      }
    }, [cards])
  );

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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

  // Reset page when card, time range, or search changes
  React.useEffect(() => {
    setPageNumber(0);
    setExpandedTxnId(null);
  }, [selectedCardId, selectedTimeRange, customDateRange, debouncedSearchQuery]);

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

  // Force refetch on card or date range change
  React.useEffect(() => {
    if (selectedCardId) {
      refetch();
    }
  }, [selectedCardId, selectedTimeRange, customDateRange, refetch]);

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
        {/* <CustomLoader loading={isFetching} /> */}
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
        {/* <CustomLoader loading={isFetching} /> */}
      </View>
    );
  }

  const transactions = useMemo(() => {
    return txnData?.content || [];
  }, [txnData]);

  const filteredTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, debouncedSearchQuery);
    return sortTransactions(filtered, 'newest');
  }, [transactions, debouncedSearchQuery]);

  const handleLoadMore = () => {
    if (!isTxnLoading && !isFetching && txnData && !txnData.last) {
      setPageNumber(prev => prev + 1);
    }
  };

  const renderTransactionItem = ({ item }: { item: any }) => {
    const { amountDisplay, color, displayName } = getFormattedTransaction(item, colors);
    const isExpanded = expandedTxnId === item.transactionRefId;

    const handlePress = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedTxnId(isExpanded ? null : item.transactionRefId);
    };

    return (
      <View style={[
        styles.transactionItem,
        {
          borderBottomColor: colors.outline,
        }
      ]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePress}
          style={styles.txnMainRow}
        >
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
          <View style={[styles.txnChevron, { transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }]}>
            <CheveronDownSVG width={ms(16)} height={ms(16)} stroke={colors.primary} />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={[styles.expandedContainer, { backgroundColor: '#edebebff' }]}>
            <View style={styles.expandedRow}>
              <CustomText type={TextType.CardSubtitle} style={styles.expandedLabel}>Description:</CustomText>
              <View style={styles.scrollableValueContainer}>
                <ScrollView nestedScrollEnabled style={{ maxHeight: ms(60) }}>
                  <CustomText type={TextType.CardText} style={styles.expandedValue}>
                    {(item.description || 'N/A').trim().replace(/\s+/g, ' ')}
                  </CustomText>
                </ScrollView>
              </View>
            </View>
            {item.merchantCategoryGroup && (
              <View style={styles.expandedRow}>
                <CustomText type={TextType.CardSubtitle} style={styles.expandedLabel}>Category:</CustomText>
                <CustomText type={TextType.CardText} style={styles.expandedValue}>{item.merchantCategoryGroup}</CustomText>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!isFetching) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={t('transactions.title')}
        rightContent={
          <TouchableOpacity style={styles.rightButton} onPress={() => { navigation.navigate('Notifications') }}>
            <NotificationSVG width={ms(24)} height={ms(24)} />
          </TouchableOpacity>
        }
      />

      {cards.length > 0 ? (
        <View style={styles.contentContainer}>
          {/* Fixed Header Elements */}
          <View style={styles.fixedHeader}>
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
              <CheveronDownSVG width={ms(20)} height={ms(20)} stroke={colors.primary} />
            </TouchableOpacity>

            {/* Search Row */}
            <View style={styles.searchRow}>
              <CustomTextInput
                placeholder={t('transactions.searchPlaceholder')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftIcon={<SearchSVG width={ms(20)} height={ms(20)} color={colors.textColorDisabled} />}
                containerStyle={styles.searchBar}
                inputContainerStyle={[
                  styles.searchInputContainer,
                  {
                    borderColor: colors.outline,
                    backgroundColor: colors.surface,
                  },
                ]}
              />
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
          </View>

          {/* Scrollable Transaction List */}
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item, index) => `${item.transactionRefId}-${index}`}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              !isTxnLoading && !isFetching ? (
                <View style={styles.emptyContainer}>
                  <CustomText type={TextType.CardSubtitle}>No transactions found</CustomText>
                </View>
              ) : null
            }
          />
        </View>
      ) : (
        <View style={styles.emptyCardContainer}>
          <CustomText type={TextType.CardSubtitle}>No cards available to show transactions</CustomText>
        </View>
      )}

      {/* Bottom Sheets */}
      <CardSelectionBottomSheet
        visible={isCardSheetVisible}
        onClose={() => setCardSheetVisible(false)}
        cards={cards}
        selectedCardId={selectedCardId}
        onSelect={(id) => {
          setSelectedCardId(id);
          setCardSheetVisible(false);
        }}
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
      <CustomLoader loading={isTxnLoading || (isFetching && pageNumber === 0)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  fixedHeader: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.s,
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
    marginBottom: 0,
  },
  searchInputContainer: {
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
    paddingVertical: Spacing.l,
    borderBottomWidth: 1,
  },
  txnMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txnLeft: {
    flex: 1,
  },
  txnRight: {
    alignItems: 'flex-end',
    marginRight: Spacing.s,
  },
  txnChevron: {
    justifyContent: 'center',
    alignItems: 'center',
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
  footerLoader: {
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  expandedContainer: {
    marginTop: Spacing.s,
    padding: Spacing.l,
    borderRadius: ms(8),
    gap: Spacing.s,
  },
  expandedRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: Spacing.s,
  },
  expandedLabel: {
    fontSize: ms(12),
    width: ms(80),
  },
  expandedValue: {
    fontSize: ms(12),
  },
  scrollableValueContainer: {
    flex: 1,
  },
  emptyCardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
});

export default TransactionsScreen;
