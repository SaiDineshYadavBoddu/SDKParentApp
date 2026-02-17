import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomButton from '../../../common/components/CustomButton';
import CustomHeader from '../../../common/components/CustomHeader';
import CustomDatePicker from '../../../common/components/CustomDatePicker';
import CardSelectionBottomSheet from '../../Transactions/Components/CardSelectionBottomSheet';
import NotificationSVG from '../../../assets/svgs/NotificationSVG';
import { calculateDateRange } from '../../../utils/transactionUtils';
import NewStatementItem from '../Components/NewStatementItem';
import StatementHistoryList from '../Components/StatementHistoryList';
import { StatementHistoryItemData } from '../Components/StatementHistoryItem';
import DownloadSVG from '../../../assets/svgs/DownloadSVG';
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS } from '../../../network/endpoint.const';
import { getAccessToken } from '../../../context/AuthContext';
import ReactNativeBlobUtil from 'react-native-blob-util';

const StatementScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [statementType, setStatementType] = useState<'new' | 'history'>('new');
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('lastMonth');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [isCardSheetVisible, setCardSheetVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const HARDCODED_CARD_ID = '22344402145871534452';

  const cardsData = useSelector((state: any) => state.card?.cards);
  const cards = useMemo(() => cardsData?.content || [], [cardsData?.content]);

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].cardIdentifier);
    } else if (cards.length === 0 && !selectedCardId) {
      // Fallback for debugging if card list API is failing
      setSelectedCardId(HARDCODED_CARD_ID);
    }
  }, [cards, selectedCardId]);

  const selectedCard = useMemo(
    () => {
      const card = cards.find((c: any) => c.cardIdentifier === selectedCardId);
      if (!card && selectedCardId === HARDCODED_CARD_ID) {
        return {
          cardIdentifier: HARDCODED_CARD_ID,
          maskedPan: '223444******4452', // Placeholder based on hardcoded ID
          cardStatus: 'Active'
        };
      }
      return card;
    },
    [cards, selectedCardId]
  );

  const dateRange = useMemo(
    () => calculateDateRange(selectedTimeRange, customDateRange),
    [selectedTimeRange, customDateRange]
  );

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!selectedCardId) return;

    setIsDownloading(true);
    const { dirs } = ReactNativeBlobUtil.fs;
    const token = getAccessToken();
    const baseUrl = 'https://sit.corporate.un.infradev.w4.az.network.ae';
    const formatValue = selectedFormat.toUpperCase();
    const fileName = `Statement_${selectedCardId}_${dateRange.dateFrom}_${dateRange.dateTo}.${selectedFormat}`;

    // POST request with query parameters (matching portal behavior)
    const params = `cardId=${selectedCardId}&dateFrom=${dateRange.dateFrom}&dateTo=${dateRange.dateTo}&format=${formatValue}`;
    const url = `${baseUrl}${API_ENDPOINTS.GET_STATEMENTS}?${params}`;

    console.log(`Download Attempt: [POST] ${url}`);

    try {
      const configWithAuth = {
        fileCache: true,
        path: Platform.OS === 'ios'
          ? `${dirs.DocumentDir}/${fileName}`
          : `${dirs.DownloadDir}/${fileName}`,
        timeout: 15000, // 15 second timeout
      };

      const res = await ReactNativeBlobUtil.config(configWithAuth).fetch(
        'POST',
        url,
        {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/octet-stream',
        }
      );

      const responseStatus = res.info().status;
      console.log(`Download Response Status: ${responseStatus}`);

      if (responseStatus >= 400) {
        setIsDownloading(false);
        let errorMsg = 'Unknown error';
        try {
          const body = await res.json();
          console.log(`Error Body:`, body);
          errorMsg = body?.message || body?.error || JSON.stringify(body);
        } catch (e) {
          try {
            const textData = await res.text();
            console.log(`Error Text:`, textData);
            errorMsg = textData || `Status ${responseStatus}`;
          } catch (e2) {
            errorMsg = `Status ${responseStatus}`;
          }
        }

        // Special handling for 504 Gateway Timeout
        if (responseStatus === 504) {
          Alert.alert(
            t('common.error'),
            'Statement generation is taking longer than expected. Please try with a smaller date range.'
          );
        } else {
          Alert.alert(
            t('common.error'),
            `Server Error ${responseStatus}: ${errorMsg}`
          );
        }
        return;
      }

      setIsDownloading(false);
      const filePath = res.path();

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.fs.scanFile([{ path: filePath, mime: selectedFormat === 'pdf' ? 'application/pdf' : 'text/csv' }]);
      }

      if (Platform.OS === 'ios') {
        ReactNativeBlobUtil.ios.openDocument(filePath);
      } else {
        Alert.alert(
          t('statements.downloadSuccess'),
          t('statements.openFileMessage'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('statements.openFile'),
              onPress: () => {
                ReactNativeBlobUtil.android.actionViewIntent(
                  filePath,
                  selectedFormat === 'pdf' ? 'application/pdf' : 'text/csv'
                );
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Download failed', error);
      setIsDownloading(false);

      // Check if it's a timeout error
      if (error.message && error.message.includes('timeout')) {
        Alert.alert(
          'Request Timeout',
          'Statement generation is taking too long. Please try with a smaller date range (e.g., Last Week instead of Last Month).'
        );
      } else {
        Alert.alert(t('common.error'), t('statements.downloadFailed'));
      }
    }
  };

  const handleTimeRangePress = (range: string) => {
    if (range === 'custom') {
      setDatePickerVisible(true);
    } else {
      setSelectedTimeRange(range);
    }
  };

  const handleHistoryDownload = useCallback(async (item: StatementHistoryItemData) => {
    if (!item.fileKey) return;

    const fileName = item.fileKey.split('/').pop() || item.fileKey;
    const { dirs } = ReactNativeBlobUtil.fs;
    const token = getAccessToken();

    try {
      const configWithAuth = {
        fileCache: true,
        path: Platform.OS === 'ios'
          ? `${dirs.DocumentDir}/${fileName}`
          : `${dirs.DownloadDir}/${fileName}`,
      };

      const res = await ReactNativeBlobUtil.config(configWithAuth).fetch(
        'GET',
        `https://sit.corporate.un.infradev.w4.az.network.ae${API_ENDPOINTS.GET_STATEMENT_DOWNLOAD}?statementName=${item.fileKey}`,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      const filePath = res.path();

      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.fs.scanFile([{ path: filePath }]);
      }

      if (Platform.OS === 'ios') {
        ReactNativeBlobUtil.ios.openDocument(filePath);
      } else {
        Alert.alert(
          t('statements.downloadSuccess'),
          t('statements.openFileMessage'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('statements.openFile'),
              onPress: () => {
                ReactNativeBlobUtil.android.actionViewIntent(
                  filePath,
                  item.fileKey?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'text/csv'
                );
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error("Download failed", error);
      Alert.alert(t('common.error'), t('statements.downloadFailed'));
    }
  }, [t]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={t('statements.title')}
        onBackPress={() => navigation.goBack()}
        rightContent={
          <TouchableOpacity style={styles.iconButton}>
            <NotificationSVG width={ms(24)} height={ms(24)} color={colors.onSurface} stroke={colors.onSurface} />
          </TouchableOpacity>
        }
      />

      <View style={{ paddingHorizontal: Spacing.l }}>
        {/* Statement Type Segmented Control */}
        <View style={[styles.segmentedControl, { backgroundColor: colors.backgroundVariant }]}>
          <TouchableOpacity
            style={[
              styles.segment,
              styles.segmentLeft,
              {
                backgroundColor: statementType === 'new' ? colors.primary : colors.backgroundVariant,
              },
            ]}
            onPress={() => setStatementType('new')}
          >
            <CustomText
              type={TextType.CardText}
              style={[
                styles.segmentText,
                {
                  color: statementType === 'new' ? colors.secondaryScreenBackground : colors.inverseSurface,
                  fontWeight: '500',
                },
              ]}
            >
              {t('statements.newStatement')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segment,
              styles.segmentRight,
              {
                backgroundColor: statementType === 'history' ? colors.primary : colors.backgroundVariant,
              },
            ]}
            onPress={() => setStatementType('history')}
          >
            <CustomText
              type={TextType.CardText}
              style={[
                styles.segmentText,
                {
                  color: statementType === 'history' ? colors.secondaryScreenBackground : colors.inverseSurface,
                  fontWeight: '500',
                },
              ]}
            >
              {t('statements.statementHistory')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {statementType === 'new' ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <NewStatementItem
              selectedCard={selectedCard}
              selectedTimeRange={selectedTimeRange}
              selectedFormat={selectedFormat}
              onCardSelect={() => setCardSheetVisible(true)}
              onTimeRangeChange={handleTimeRangePress}
              onFormatChange={setSelectedFormat}
            />
          </ScrollView>
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={handleDownload}
              disabled={!selectedCardId || isDownloading}
              style={[
                styles.downloadButton,
                {
                  backgroundColor: colors.primary,
                  opacity: (!selectedCardId || isDownloading) ? 0.6 : 1
                }
              ]}
              activeOpacity={0.7}
            >
              {isDownloading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <>
                  <DownloadSVG />
                  <CustomText type={TextType.ActionLabel} style={{ color: colors.onPrimary }}>{t('statements.download')}</CustomText>
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: Spacing.l }}>
          <StatementHistoryList
            cardId={selectedCardId}
            onDownload={handleHistoryDownload}
          />
        </View>
      )}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconButton: {
    padding: ms(4),
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xxl,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginBottom: Spacing.l,
    marginTop: Spacing.s,
    borderRadius: ms(8),
    padding: ms(4),
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLeft: {
    // borderTopLeftRadius: ms(8),
    // borderBottomLeftRadius: ms(8),
    borderRadius: ms(8),
  },
  segmentRight: {
    // borderTopRightRadius: ms(8),
    // borderBottomRightRadius: ms(8),
    borderRadius: ms(8),
  },
  segmentText: {
    // Text styles handled inline for dynamic colors
  },
  bottomContainer: {
    padding: Spacing.l,
    backgroundColor: 'transparent',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: Spacing.m,
    borderRadius: ms(8),
    gap: Spacing.m
  },
});

export default StatementScreen;

