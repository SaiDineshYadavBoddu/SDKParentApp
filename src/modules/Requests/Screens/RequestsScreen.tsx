import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Platform, Animated } from 'react-native';
import CustomHeader from '../../../common/components/CustomHeader';
import NotificationSVG from '../../../assets/svgs/NotificationSVG';
import SearchSVG from '../../../assets/svgs/SearchSVG';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import CustomTextInput from '../../../common/components/CustomTextInput';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { Spacing } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomDropdown from '../../../common/components/CustomDropdown';
import CustomButton from '../../../common/components/CustomButton';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import FilterSVG from '../../../assets/svgs/FilterSVG';
import DatePickerSVG from '../../../assets/svgs/DatePickerSVG';
import { Keyboard, Pressable, TouchableOpacity } from 'react-native';
import CustomDatePicker from '../../../common/components/CustomDatePicker';
import RequestInfoGroup, {
  getStatusColors,
  getProgressStatusColor,
  getProgressStatusIcon,
  renderIcon,
  RequestDetail
} from '../Components/RequestInfoGroup';
import RequestDetailBottomSheet from '../Components/RequestDetailBottomSheet';
import { TimelineEvent } from '../Components/RequestTimeline';
import { useTranslation } from 'react-i18next';

// Types
type RequestStatus = 'Activation' | 'In progress' | 'Card unblocking' | 'Resolved';

type RequestItem = {
  id: string;
  requestNumber: string;
  badgeText: string;
  details: RequestDetail[];
  technicalDetails?: Array<{ label: string; value: string }>;
  timeline?: TimelineEvent[];
};

const STATUS_OPTIONS = ['approved', 'rejected', 'inProgress', 'resolved'];
const REQUEST_TYPE_OPTIONS = ['activation', 'cardUnblocking', 'replacement', 'dispute'];

// Mock data based on the UI
const REQUESTS_DATA: RequestItem[] = [
  {
    id: '1',
    requestNumber: '#2644',
    badgeText: 'activation',
    details: [
      {
        userName: 'Sharmil Panayan',
        userIconType: 'clock',
        status: 'inProgress',
      },
      {
        userName: 'Marcin Parakaran',
        userIconType: 'check',
        dateText: '04-04-2025',
      },
    ],
    technicalDetails: [
      { label: 'BankId', value: 'D2C' },
      { label: 'BankId', value: '2234440214248...' },
      { label: 'cardMaskedPan', value: '223444******0907' },
      { label: 'cardholderRequest', value: 'True' },
      { label: 'companyId', value: '173366680969...' },
      { label: 'customerId', value: '173366680969...' },
      { label: 'requester', value: 'sharmil200' },
      { label: 'requesterId', value: '17e70b54-1b60-...' },
    ],
    timeline: [
      { title: 'Auto approved: 20-11-2025 at 11:43:21', isCompleted: true },
      { title: 'Processed successfully', isCompleted: true },
      { title: 'Completed', isCompleted: true },
    ],
  },
  {
    id: '2',
    requestNumber: '#2644',
    badgeText: 'cardUnblocking',
    details: [
      {
        userName: 'Sharmil Panayan',
        userIconType: 'clock',
        status: 'resolved',
      },
      {
        userName: 'Marcin Parakaran',
        userIconType: 'check',
        dateText: '24-11-2025',
      },
    ],
    technicalDetails: [
      { label: 'BankId', value: 'D2C' },
      { label: 'BankId', value: '2234440214248...' },
      { label: 'cardMaskedPan', value: '223444******0907' },
      { label: 'cardholderRequest', value: 'True' },
    ],
    timeline: [
      { title: 'Auto approved: 20-11-2025 at 10:00:00', isCompleted: true },
      { title: 'Processing', isCompleted: false },
    ],
  },
];

// Redundant local helpers removed, now imported from RequestInfoGroup

const RequestsScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [filterView, setFilterView] = useState<'main' | 'status' | 'type'>('main');

  const [selectedStatus, setSelectedStatus] = useState('approved');
  const [selectedRequestType, setSelectedRequestType] = useState('cardUnblocking');
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [isDetailSheetVisible, setIsDetailSheetVisible] = useState(false);

  // Dynamic Date Range (Last 30 Days)
  const getInitialDates = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  };

  const initialDates = getInitialDates();
  const [startDate, setStartDate] = useState(initialDates.start);
  const [endDate, setEndDate] = useState(initialDates.end);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const resetFilters = () => {
    const dates = getInitialDates();
    setSelectedStatus('approved');
    setSelectedRequestType('cardUnblocking');
    setStartDate(dates.start);
    setEndDate(dates.end);
    setFilterView('main');
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
  };



  const toggleFilterView = (view: 'main' | 'status' | 'type') => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: view === 'main' ? 20 : -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setFilterView(view);
      slideAnim.setValue(view === 'main' ? -20 : 20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  // Local renderIcon removed, now imported from RequestInfoGroup

  const renderRequestItem = ({ item }: { item: RequestItem }) => {
    const { backgroundColor, textColor } = getStatusColors(item.badgeText, colors);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setSelectedRequest(item);
          setIsDetailSheetVisible(true);
        }}
        style={[styles.requestCard, { backgroundColor: colors.surface }]}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <CustomText type={TextType.CardTitle} style={[styles.requestID, { color: colors.onSurface }]}>
            {t('requests.idPrefix')} {item.requestNumber}
          </CustomText>
          <View style={[styles.badge, { backgroundColor }]}>
            <View style={[styles.badgeDot, { backgroundColor: textColor }]} />
            <CustomText type={TextType.CardSubtitle} style={[styles.badgeText, { color: textColor }]}>
              {t(`requests.types.${item.badgeText}`)}
            </CustomText>
          </View>
        </View>

        {/* Details Rows - Refactored into generic component */}
        <RequestInfoGroup details={item.details} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ backgroundColor: colors.screenBackground, flex: 1 }}>
      <CustomHeader
        title={t('requests.title')}
        rightContent={
          <TouchableOpacity style={styles.rightButton}>
            <NotificationSVG width={ms(24)} height={ms(24)} />
          </TouchableOpacity>
        }
      />

      <View style={styles.container}>
        {/* Search Row */}
        <View style={styles.searchRow}>
          <CustomTextInput
            placeholder={t('requests.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<SearchSVG width={ms(20)} height={ms(20)} />}
            containerStyle={styles.searchBar}
            inputContainerStyle={[styles.searchInputContainer, { borderColor: colors.outline, backgroundColor: colors.surface }]}
          />
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: colors.filterButtonBg }]}
            onPress={() => {
              Keyboard.dismiss();
              // Small delay to allow keyboard to start dismissing
              setTimeout(() => {
                setIsFilterSheetVisible(true);
              }, 100);
            }}
          >
            <FilterSVG width={ms(24)} height={ms(24)} />
          </TouchableOpacity>
        </View>

        <CustomText type={TextType.CardSubtitle} style={[styles.requestCountText, Typography.labelMedium, { color: colors.tertiaryText }]}>
          {REQUESTS_DATA.length} {t('requests.count')}
        </CustomText>

        <FlatList
          data={REQUESTS_DATA}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <CustomBottomSheet
        visible={isFilterSheetVisible}
        onClose={() => {
          if (filterView !== 'main') {
            toggleFilterView('main');
          } else {
            setIsFilterSheetVisible(false);
            // Reset values after a small delay to not show changes during closing animation
            setTimeout(resetFilters, 300);
          }
        }}
        title={
          filterView === 'status'
            ? t('requests.filters.selectStatus')
            : filterView === 'type'
              ? t('requests.filters.selectType')
              : t('requests.filters.title')
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateX: slideAnim }] }}>
          {filterView === 'status' ? (
            <View style={styles.selectionContent}>
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.6}
                  delayPressIn={0}
                   style={[
                    styles.selectionItem,
                    {
                      borderColor: selectedStatus === option ? colors.primary : colors.outline,
                      backgroundColor: colors.surface
                    }
                  ]}
                  onPress={() => {
                    setSelectedStatus(option);
                    toggleFilterView('main');
                  }}
                >
                  <View pointerEvents="none">
                    <CustomRadioButton
                      label={t(`requests.status.${option}`)}
                      selected={selectedStatus === option}
                      onPress={() => { }}
                      labelStyle={styles.selectionLabel}
                      containerStyle={{ marginVertical: 0 }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : filterView === 'type' ? (
            <View style={styles.selectionContent}>
              {REQUEST_TYPE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.6}
                  delayPressIn={0}
                   style={[
                    styles.selectionItem,
                    {
                      borderColor: selectedRequestType === option ? colors.primary : colors.outline,
                      backgroundColor: colors.surface
                    }
                  ]}
                  onPress={() => {
                    setSelectedRequestType(option);
                    toggleFilterView('main');
                  }}
                >
                  <View pointerEvents="none">
                    <CustomRadioButton
                      label={t(`requests.types.${option}`)}
                      selected={selectedRequestType === option}
                      onPress={() => { }}
                      labelStyle={styles.selectionLabel}
                      containerStyle={{ marginVertical: 0 }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.filterContent}>
              <View style={styles.filterSection}>
                <CustomText type={TextType.Label} style={[styles.filterLabel, { color: colors.onBackground }]}>
                  {t('requests.filters.dateRange')}
                </CustomText>
                <TouchableOpacity
                  onPress={() => setIsDatePickerVisible(true)}
                  style={styles.rangeInputWrapper}
                >
                  <CustomTextInput
                    value={`${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`}
                    editable={false}
                    pointerEvents="none"
                    rightIcon={<DatePickerSVG width={ms(20)} height={ms(20)} />}
                    inputContainerStyle={[styles.filterInputContainer, { borderColor: colors.outline }]}
                    inputStyle={Typography.bodySmall}
                  />
                </TouchableOpacity>

                <CustomDatePicker
                  visible={isDatePickerVisible}
                  initialStartDate={startDate}
                  initialEndDate={endDate}
                  maxDate={new Date().toISOString().split('T')[0]}
                  onClose={() => setIsDatePickerVisible(false)}
                  onApply={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                    setIsDatePickerVisible(false);
                  }}
                />
              </View>

              <View style={styles.filterSection}>
                <CustomText type={TextType.Label} style={[styles.filterLabel, { color: colors.onBackground }]}>
                  {t('requests.filters.statusLabel')}
                </CustomText>
                <CustomDropdown
                  label=""
                  selectedValue={t(`requests.status.${selectedStatus}`)}
                  onPress={() => toggleFilterView('status')}
                  innerContainerStyle={[styles.filterInputContainer, { borderColor: colors.outline }]}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>

              <View style={styles.filterSection}>
                <CustomText type={TextType.Label} style={[styles.filterLabel, { color: colors.onBackground }]}>
                  {t('requests.filters.typeLabel')}
                </CustomText>
                <CustomDropdown
                  label=""
                  selectedValue={t(`requests.types.${selectedRequestType}`)}
                  onPress={() => toggleFilterView('type')}
                  innerContainerStyle={[styles.filterInputContainer, { borderColor: colors.outline }]}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>

              <View style={styles.filterActions}>
                <CustomButton
                  title={t('common.reset')}
                  variant="outlined"
                  onPress={() => {
                    // setIsFilterSheetVisible(false);
                    setTimeout(resetFilters, 300);
                  }}
                  style={[styles.resetButton, { borderColor: colors.primary }]}
                  uppercase={false}
                />
                <CustomButton
                  title={t('requests.filters.apply')}
                  onPress={() => setIsFilterSheetVisible(false)}
                  style={styles.applyButton}
                  uppercase={false}
                />
              </View>
            </View>
          )}
        </Animated.View>
      </CustomBottomSheet>

      <RequestDetailBottomSheet
        visible={isDetailSheetVisible}
        onClose={() => setIsDetailSheetVisible(false)}
        request={selectedRequest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ms(16),
  },
  rightButton: {
    padding: ms(6),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    marginTop: Spacing.m,
  },
  searchBar: {
    flex: 1,
    marginBottom: 0,
  },
  searchInputContainer: {
    borderWidth: 1,
    borderRadius: ms(8),
  },
  filterButton: {
    padding: ms(10),
    borderRadius: ms(8),
  },
  requestCountText: {
    marginVertical: Spacing.m,
  },
  listContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.m,
  },
  requestCard: {
    borderRadius: ms(16),
    padding: ms(16),
    gap: Spacing.m,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestID: {
    fontWeight: '700',
    fontSize: ms(14),
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(12),
    gap: ms(4),
  },
  badgeDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  badgeText: {
    fontSize: ms(11),
    fontWeight: '500',
  },
  filterContent: {
    gap: Spacing.xl,
    paddingBottom: Spacing.m,
  },
  filterSection: {
    gap: Spacing.s,
  },
  filterLabel: {
    fontWeight: '600',
    marginBottom: 0,
  },
  filterInputContainer: {
    height: ms(48),
  },
  filterActions: {
    flexDirection: 'row',
    gap: Spacing.m,
    marginTop: Spacing.s,
  },
  resetButton: {
    flex: 1,
  },
  applyButton: {
    flex: 1,
  },
  selectionContent: {
    gap: Spacing.m,
    paddingBottom: Spacing.l,
  },
  selectionItem: {
    borderRadius: ms(12),
    padding: ms(12),
    borderWidth: 1,
    borderBottomWidth: 1,
  },
  selectionLabel: {
    fontSize: ms(16),
    fontWeight: '500',
  },
  rangeInputWrapper: {
    width: '100%',
  },
});

export default RequestsScreen;
