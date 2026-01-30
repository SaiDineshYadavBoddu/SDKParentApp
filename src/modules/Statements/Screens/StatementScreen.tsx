import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

const StatementScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  
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

  const handleHistoryDownload = useCallback((item: StatementHistoryItemData) => {
    // TODO: Implement download logic for history item
    console.log('Download statement history:', item);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background}]}>
      <CustomHeader
        title={t('statements.title')}
        rightContent={
          <TouchableOpacity style={styles.iconButton}>
            <NotificationSVG width={ms(24)} height={ms(24)} color={colors.onSurface} stroke={colors.onSurface} />
          </TouchableOpacity>
        }
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Statement Type Segmented Control */}
        <View style={styles.segmentedControl}>
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
                  color: statementType === 'new' ? colors.onPrimary : colors.secondaryText,
                  fontWeight: statementType === 'new' ? '600' : '400',
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
                  color: statementType === 'history' ? colors.onPrimary : colors.secondaryText,
                  fontWeight: statementType === 'history' ? '600' : '400',
                },
              ]}
            >
              {t('statements.statementHistory')}
            </CustomText>
          </TouchableOpacity>
        </View>

        {statementType === 'new' && (
          <NewStatementItem
            selectedCard={selectedCard}
            selectedTimeRange={selectedTimeRange}
            selectedFormat={selectedFormat}
            onCardSelect={() => setCardSheetVisible(true)}
            onTimeRangeChange={handleTimeRangePress}
            onFormatChange={setSelectedFormat}
          />
        )}

        {statementType === 'history' && (
          <StatementHistoryList
            cardId={selectedCardId}
            onDownload={handleHistoryDownload}
          />
        )}
      </ScrollView>

      {/* Download Button */}
      {statementType === 'new' && (
        <View style={styles.bottomContainer}>
          <CustomButton
            title={t('statements.download')}
            onPress={handleDownload}
            disabled={!selectedCardId}
            style={styles.downloadButton}
            uppercase={false}
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
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentLeft: {
    borderTopLeftRadius: ms(8),
    borderBottomLeftRadius: ms(8),
  },
  segmentRight: {
    borderTopRightRadius: ms(8),
    borderBottomRightRadius: ms(8),
  },
  segmentText: {
    // Text styles handled inline for dynamic colors
  },
  bottomContainer: {
    padding: Spacing.l,
    backgroundColor: 'transparent',
  },
  downloadButton: {
    width: '100%',
  },
});

export default StatementScreen;

