import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Animated, ActivityIndicator, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
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
import CustomDatePicker from '../../../common/components/CustomDatePicker';
import RequestInfoGroup from '../Components/RequestInfoGroup';
import {
  getStatusColors,
  getProgressStatusColor,
  getProgressStatusIcon,
  renderIcon,
} from '../../../utils/requestUtils';
import RequestDetailBottomSheet from '../Components/RequestDetailBottomSheet';
import { TimelineEvent } from '../Components/RequestTimeline';
import { useTranslation } from 'react-i18next';
import { useGetRequestsQuery, useGetRequestTypesQuery } from '../../../network/requests/request.api';
import CustomLoader from '../../../common/components/CustomLoader';

import { RequestAction, RequestItem } from '../../../network/requests/request.types';



// Redundant local helpers removed, now imported from RequestInfoGroup

const RequestsScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const STATUS_OPTIONS = [
    { name: 'AUTO_APPROVED', displayName: t('requests.status.AUTO_APPROVED') },
    { name: 'APPROVED', displayName: t('requests.status.APPROVED') },
    { name: 'PENDING_APPROVAL', displayName: t('requests.status.PENDING_APPROVAL') },
    { name: 'CANCELLED', displayName: t('requests.status.CANCELLED') },
    { name: 'REJECTED', displayName: t('requests.status.REJECTED') },
    { name: 'DONE', displayName: t('requests.status.DONE') },
    { name: 'FAILED', displayName: t('requests.status.FAILED') },
  ];
  const [filterView, setFilterView] = useState<'main' | 'status' | 'type'>('main');

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRequestType, setSelectedRequestType] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [isDetailSheetVisible, setIsDetailSheetVisible] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const PAGE_SIZE = 6;

  const [appliedFilters, setAppliedFilters] = useState({
    status: '',
    type: '',
    startDate: '',
    endDate: '',
  });

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const resetFilters = () => {
    setSelectedStatus('');
    setSelectedRequestType('');
    setStartDate('');
    setEndDate('');
    setAppliedFilters({
      status: '',
      type: '',
      startDate: '',
      endDate: '',
    });
    setFilterView('main');
    setPageNumber(0);
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const { data, isLoading, isFetching, error } = useGetRequestsQuery({
    status: appliedFilters.status || undefined,
    actionType: appliedFilters.type || undefined,
    startDate: appliedFilters.startDate || undefined,
    endDate: appliedFilters.endDate || undefined,
    pageNumber,
    pageSize: PAGE_SIZE,
    sortProperty: 'DATE',
    sortDirection: 'DESC',
    search: debouncedSearchQuery || undefined,
  })

  useEffect(() => {
    if (isFilterSheetVisible) {
      setSelectedStatus(appliedFilters.status);
      setSelectedRequestType(appliedFilters.type);
      setStartDate(appliedFilters.startDate);
      setEndDate(appliedFilters.endDate);
      setFilterView('main');
    }
  }, [isFilterSheetVisible]);

  const handleLoadMore = () => {
    if (!isFetching && !isLoading && !error && data && !data.last) {
      setPageNumber(prev => prev + 1);
    }
  };

  const renderFooter = () => {
    if (isFetching && pageNumber > 0) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    
    return null;
  };

  const { data: requestTypes } = useGetRequestTypesQuery()

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
    const mainAction = item.actions[0];
    const { backgroundColor, textColor } = getStatusColors(mainAction?.actionType || 'default', colors);

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
            {t('requests.idPrefix')} {item.id}
          </CustomText>
          <View style={[styles.badge, { backgroundColor }]}>
            <View style={[styles.badgeDot, { backgroundColor: textColor }]} />
            <CustomText type={TextType.CardSubtitle} style={[styles.badgeText, { color: textColor }]}>
              {mainAction?.displayName || t(`requests.status.${item.status}`)}
            </CustomText>
          </View>
        </View>

        {/* Details Rows */}
        <RequestInfoGroup item={item} />
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Search Row */}
          <View style={styles.searchRow}>
            <CustomTextInput
              placeholder={t('requests.searchPlaceholder')}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setPageNumber(0);
              }}
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
            {data?.totalElements || 0} {t('requests.count')}
          </CustomText>

          <FlatList
            data={data?.content || []}
            renderItem={renderRequestItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={renderFooter}
            ListEmptyComponent={
              !isLoading && !isFetching ? (
                <View style={styles.emptyContainer}>
                  <CustomText type={TextType.CardText} style={styles.emptyText}>
                    {t('requests.noRequests')}
                  </CustomText>
                </View>
              ) : null
            }
            contentContainerStyle={styles.listContent}
          />
        </View>
      </TouchableWithoutFeedback>

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
                  key={option.name}
                  activeOpacity={0.6}
                  delayPressIn={0}
                  style={[
                    styles.selectionItem,
                    {
                      borderColor: selectedStatus === option.name ? colors.primary : colors.outline,
                      backgroundColor: colors.surface
                    }
                  ]}
                  onPress={() => {
                    setSelectedStatus(option.name);
                    toggleFilterView('main');
                  }}
                >
                  <View pointerEvents="none">
                    <CustomRadioButton
                      label={option.displayName}
                      selected={selectedStatus === option.name}
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
              {requestTypes && requestTypes.length > 0 ? (
                requestTypes.map((option: { name: string; displayName: string }) => (
                  <TouchableOpacity
                    key={option.name}
                    activeOpacity={0.6}
                    delayPressIn={0}
                    style={[
                      styles.selectionItem,
                      {
                        borderColor: selectedRequestType === option.name ? colors.primary : colors.outline,
                        backgroundColor: colors.surface
                      }
                    ]}
                    onPress={() => {
                      setSelectedRequestType(option.name);
                      toggleFilterView('main');
                    }}
                  >
                    <View pointerEvents="none">
                      <CustomRadioButton
                        label={option.displayName}
                        selected={selectedRequestType === option.name}
                        onPress={() => { }}
                        labelStyle={styles.selectionLabel}
                        containerStyle={{ marginVertical: 0 }}
                      />
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <CustomText type={TextType.CardText} style={{ textAlign: 'center', marginTop: Spacing.m }}>
                  {t('requests.filters.noTypesAvailable')}
                </CustomText>
              )}
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
                    value={startDate && endDate ? `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}` : t('datePicker.selectRange')}
                    editable={false}
                    pointerEvents="none"
                    rightIcon={<DatePickerSVG width={ms(20)} height={ms(20)} />}
                    inputContainerStyle={[
                      styles.filterInputContainer, 
                      { 
                        borderColor: colors.outline,
                        backgroundColor: colors.surface // Force surface background even if editable is false
                      }
                    ]}
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
                  selectedValue={
                    STATUS_OPTIONS.find(s => s.name === selectedStatus)?.displayName || 
                    (selectedStatus === '' ? t('requests.filters.selectStatus') : selectedStatus)
                  }
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
                  selectedValue={
                    requestTypes?.find((t: any) => t.name === selectedRequestType)?.displayName || 
                    (selectedRequestType === '' ? t('requests.filters.selectType') : selectedRequestType)
                  }
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
                  disabled={
                    selectedStatus === appliedFilters.status &&
                    selectedRequestType === appliedFilters.type &&
                    startDate === appliedFilters.startDate &&
                    endDate === appliedFilters.endDate
                  }
                  onPress={() => {
                    setPageNumber(0);
                    setAppliedFilters({
                      status: selectedStatus,
                      type: selectedRequestType,
                      startDate,
                      endDate,
                    });
                    setIsFilterSheetVisible(false);
                  }}
                  style={styles.applyButton}
                  uppercase={false}
                />
              </View>
            </View>
          )}
        </Animated.View>
      </CustomBottomSheet>

      <RequestDetailBottomSheet
        key={selectedRequest?.id}
        visible={isDetailSheetVisible}
        onClose={() => {
          setIsDetailSheetVisible(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
      />
      <CustomLoader loading={isLoading || (isFetching && pageNumber === 0)} />
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
    paddingBottom: ms(100),
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
  footerContainer: {
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  footerText: {
    opacity: 0.6,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: ms(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
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
