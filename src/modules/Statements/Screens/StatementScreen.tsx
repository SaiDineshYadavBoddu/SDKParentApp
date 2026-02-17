import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Share,
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
import CustomLoader from '../../../common/components/CustomLoader';
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
import { navigateToServerErrorScreen, navigateToTimeoutScreen } from '../../../utils/navigationUtils';
import ConfirmationBottomSheet from '../../../common/components/ConfirmationBottomSheet';

const FORMAT_CONFIG: Record<string, { extension: string; mime: string }> = {
  pdf: { extension: 'pdf', mime: 'application/pdf' },
  csv: { extension: 'csv', mime: 'text/csv' },
  excel: { extension: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  word: { extension: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
};

const getMimeType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return 'application/pdf';
  if (extension === 'csv') return 'text/csv';
  if (extension === 'xlsx' || extension === 'xls' || fileName.toLowerCase().includes('excel')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if (extension === 'docx' || extension === 'doc' || fileName.toLowerCase().includes('word')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return 'application/octet-stream';
};

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
  const [downloadSuccessVisible, setDownloadSuccessVisible] = useState(false);
  const [downloadedFileData, setDownloadedFileData] = useState<{ path: string; mime: string } | null>(null);

  const cardsData = useSelector((state: any) => state.card?.cards);
  const cards = useMemo(() => cardsData?.content || [], [cardsData?.content]);

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].cardIdentifier);
    } else if (cards.length === 0 && !selectedCardId) {
      // Fallback for debugging if card list API is failing
    }
  }, [cards, selectedCardId]);

  const selectedCard = useMemo(
    () => {
      const card = cards.find((c: any) => c.cardIdentifier === selectedCardId);
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
    const config = FORMAT_CONFIG[selectedFormat] || FORMAT_CONFIG.csv;
    const fileName = `Statement_${selectedCardId}_${dateRange.dateFrom}_${dateRange.dateTo}.${config.extension}`;

    // POST request with query parameters (matching portal behavior)
    const params = `cardId=${selectedCardId}&dateFrom=${dateRange.dateFrom}&dateTo=${dateRange.dateTo}&format=${formatValue}`;
    const url = `${baseUrl}${API_ENDPOINTS.GET_STATEMENTS}?${params}`;

    console.log(`Download Attempt: [POST] ${url}`);

    try {
      const configWithAuth = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: false, // Handle download manually to support POST with Auth headers
          notification: true,
          title: fileName,
          description: 'Downloading statement...',
          mime: config.mime,
          path: `${dirs.DownloadDir}/${fileName}`,
        },
        path: Platform.OS === 'ios'
          ? `${dirs.DocumentDir}/${fileName}`
          : `${dirs.DownloadDir}/${fileName}`,
        timeout: 20000, // 20 second timeout
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
          navigateToTimeoutScreen();
        } else {
          // Alert.alert(
          //   t('common.error'),
          //   `Server Error ${responseStatus}: ${errorMsg}`
          // );
          navigateToServerErrorScreen();
        }
        return;
      }

      setIsDownloading(false);
      const filePath = res.path();
      console.log('✅ Statement saved to:', filePath);

      if (Platform.OS === 'android') {
        try {
          // Modern way to save to public Downloads folder on Android 10+
          const publicPath = await (ReactNativeBlobUtil.MediaCollection as any).copyToMediaStore(
            {
              name: fileName,
              parentFolder: '', // Root of Downloads
              mimeType: config.mime,
            },
            'Download',
            filePath
          );
          console.log('✅ Statement copied to public Downloads:', publicPath);

          // Still register it in the download history for visibility
          ReactNativeBlobUtil.android.addCompleteDownload({
            title: fileName,
            description: 'Statement downloaded successfully',
            mime: config.mime,
            path: publicPath || filePath,
            showNotification: true,
          });
        } catch (copyError) {
          console.error('Failed to copy to MediaStore, falling back to basic scan:', copyError);
          await ReactNativeBlobUtil.fs.scanFile([{ path: filePath, mime: config.mime }]);
        }
      }

      if (Platform.OS === 'ios') {
        setTimeout(async () => {
          try {
            await Share.share({
              url: `file://${filePath}`,
              title: 'Share Statement',
            });
          } catch (error) {
            console.error('Error sharing file:', error);
          }
        }, 100);
      } else {
        setDownloadedFileData({ path: filePath, mime: config.mime });
        setDownloadSuccessVisible(true);
      }
    } catch (error: any) {
      console.error('Download failed', error);
      setIsDownloading(false);

      // Check if it's a timeout error
      if (error.message && (error.message.includes('timeout') || error.message.includes('timed out'))) {
        navigateToTimeoutScreen();
      } else {
        // Alert.alert(t('common.error'), t('statements.downloadFailed'));
        navigateToServerErrorScreen();
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
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: fileName,
          description: 'Downloading statement history...',
          mime: getMimeType(fileName),
          path: `${dirs.DownloadDir}/${fileName}`,
        },
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
      console.log('✅ History statement saved to:', filePath);

      if (Platform.OS === 'android') {
        try {
          const mimeType = getMimeType(fileName);
          const publicPath = await (ReactNativeBlobUtil.MediaCollection as any).copyToMediaStore(
            {
              name: fileName,
              parentFolder: '',
              mimeType: mimeType,
            },
            'Download',
            filePath
          );
          console.log('✅ History statement copied to public Downloads:', publicPath);
        } catch (copyError) {
          console.error('Failed to copy history to MediaStore:', copyError);
          await ReactNativeBlobUtil.fs.scanFile([{ path: filePath }]);
        }
      }

      if (Platform.OS === 'ios') {
        setTimeout(async () => {
          try {
            await Share.share({
              url: `file://${filePath}`,
              title: 'Share Statement',
            });
          } catch (error) {
            console.error('Error sharing file:', error);
          }
        }, 100);
      } else {
        setDownloadedFileData({ path: filePath, mime: getMimeType(fileName) });
        setDownloadSuccessVisible(true);
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
              <DownloadSVG />
              <CustomText type={TextType.ActionLabel} style={{ color: colors.onPrimary }}>{t('statements.download')}</CustomText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: Spacing.l }}>
          <StatementHistoryList
            cardId={selectedCardId}
            onDownload={(item) => {
              setIsDownloading(true);
              handleHistoryDownload(item).finally(() => setIsDownloading(false));
            }}
          />
        </View>
      )}

      <CustomLoader loading={isDownloading} title={t('loader.title')} />

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
      <CustomLoader loading={isDownloading} />

      <ConfirmationBottomSheet
        visible={downloadSuccessVisible}
        onClose={() => setDownloadSuccessVisible(false)}
        title={t('statements.downloadSuccess')}
        message={t('statements.openFileMessage')}
        confirmText={t('statements.openFile')}
        cancelText={t('common.cancel')}
        onConfirm={() => {
          if (downloadedFileData) {
            ReactNativeBlobUtil.android.actionViewIntent(
              downloadedFileData.path,
              downloadedFileData.mime
            );
          }
          setDownloadSuccessVisible(false);
        }}
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

