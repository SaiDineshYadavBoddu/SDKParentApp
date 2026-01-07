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
import { ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomIcon from '../../../common/components/CustomIcon';
import CustomImage from '../../../common/components/CustomImage';
import NotificationSVG from '../../../assets/svgs/NotificationSVG';
import SearchSVG from '../../../assets/svgs/SearchSVG';
import FilterSVG from '../../../assets/svgs/FilterSVG';
import ExportSVG from '../../../assets/svgs/ExportSVG';
import ChevronSVG from '../../../assets/svgs/ChevronSVG';
import { MOCK_TRANSACTIONS, MOCK_CARDS } from '../../../constants/mockData';
import CardSelectionBottomSheet from '../Components/CardSelectionBottomSheet';
import TransactionsFilterBottomSheet from '../Components/TransactionsFilterBottomSheet';

const TIME_RANGES = ['lastWeek', 'lastMonth', 'last3Months', 'custom'];

const TransactionsScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardId, setSelectedCardId] = useState(MOCK_CARDS[0].id);
  const [selectedTimeRange, setSelectedTimeRange] = useState('lastWeek');
  const [isCardSheetVisible, setCardSheetVisible] = useState(false);
  const [isFilterSheetVisible, setFilterSheetVisible] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '',
    status: 'Approved',
    sortBy: 'newest',
  });

  const selectedCard = useMemo(
    () => MOCK_CARDS.find((c) => c.id === selectedCardId),
    [selectedCardId]
  );

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((txn) => {
      const matchesSearch = txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.txnId.includes(searchQuery);
      const matchesCard = txn.cardId === selectedCardId;
      // In a real app, we would filter by date and status here
      return matchesSearch && matchesCard;
    }).sort((a, b) => {
      // Very basic manual sort simulation
      return filters.sortBy === 'newest' ? (a.id < b.id ? 1 : -1) : (a.id > b.id ? 1 : -1);
    });
  }, [searchQuery, selectedCardId, filters]);

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View style={styles.txnLeft}>
        <CustomText type={TextType.CardTitle} style={styles.txnTitle}>{item.title}</CustomText>
        <CustomText type={TextType.CardSubtitle} style={styles.txnId}>{item.txnId}</CustomText>
      </View>
      <View style={styles.txnRight}>
        <CustomText
          type={TextType.CardTitle}
          style={[styles.txnAmount, { color: item.isCredit ? '#28A745' : colors.onSurface }]}
        >
          {item.isCredit ? `+ ${item.amount}` : item.amount}
        </CustomText>
        <CustomText type={TextType.CardSubtitle} style={styles.txnDate}>{item.date}</CustomText>
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
            style={[styles.actionButton, { borderColor: colors.outline, backgroundColor: '#EDF5FA' }]}
            onPress={() => setFilterSheetVisible(true)}
          >
            <FilterSVG width={ms(20)} height={ms(20)} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { borderColor: colors.outline, backgroundColor: '#EDF5FA' }]}>
            <ExportSVG width={ms(20)} height={ms(20)} color={colors.primary} />
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
            <TouchableOpacity
              key={range}
              onPress={() => setSelectedTimeRange(range)}
              style={[
                styles.timeChip,
                {
                  backgroundColor: selectedTimeRange === range ? colors.primary : '#F5F5F5',
                },
              ]}
            >
              <CustomText
                type={TextType.CardText}
                style={{
                  color: selectedTimeRange === range ? '#FFF' : '#666',
                  fontWeight: selectedTimeRange === range ? '600' : '400',
                }}
              >
                {t(`transactions.timeRanges.${range}`)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transaction List */}
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
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
        cards={MOCK_CARDS}
        selectedCardId={selectedCardId}
        onSelect={setSelectedCardId}
      />
      <TransactionsFilterBottomSheet
        visible={isFilterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        initialFilters={filters}
        onApply={setFilters}
      />
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
  timeRangeScroll: {
    marginBottom: Spacing.l,
  },
  timeRangeContent: {
    gap: Spacing.s,
  },
  timeChip: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: ms(8),
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

