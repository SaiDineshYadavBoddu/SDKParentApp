import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
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
  const [selectedTimeRange, setSelectedTimeRange] = useState('lastWeek');
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [isCardSheetVisible, setCardSheetVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const cardsData = useSelector((state: any) => state.card?.cards);
  const cards = useMemo(() => cardsData?.content || [], [cardsData?.content]);

  useEffect(() => {
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

  const handleDownload = () => {
    // TODO: Implement download logic
    console.log('Download statement:', {
      cardId: selectedCardId,
      timeRange: selectedTimeRange,
      format: selectedFormat,
      dateRange,
    });
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
          path: `${dirs.DownloadDir}/${fileName}`,
          description: 'Downloading statement...',
          mediaScannable: true,
        },
        path: Platform.OS === 'ios' ? `${dirs.DocumentDir}/${fileName}` : undefined,
      };

      const res = await ReactNativeBlobUtil.config(configWithAuth).fetch(
        'GET',
        `https://sit.corporate.un.infradev.w4.az.network.ae${API_ENDPOINTS.GET_STATEMENT_DOWNLOAD}?statementName=${item.fileKey}`,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (Platform.OS === 'ios') {
         ReactNativeBlobUtil.ios.openDocument(res.data);
      } else {
         // Android handles notification automatically with DownloadManager
      }
    } catch (error) {
       console.error("Download failed", error);
       Alert.alert(t('common.error'), t('statements.downloadFailed'));
    }
  }, [t]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background}]}>
      <CustomHeader
        title={t('statements.title')}
        onBackPress={()=>navigation.goBack()}
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
              disabled={!selectedCardId}
              style={[styles.downloadButton, { backgroundColor: colors.primary }]}
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

