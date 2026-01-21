import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomImage from '../../../common/components/CustomImage';
import CustomChip from '../../../common/components/CustomChip';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import ChevronSVG from '../../../assets/svgs/ChevronSVG';
import FileIconSVG from '../../../assets/svgs/FileIconSVG';

const STATEMENT_TIME_RANGES = ['lastWeek', 'lastMonth', 'last3Months', 'custom'];
const EXPORT_FORMATS = ['csv', 'excel', 'pdf', 'word'];

interface NewStatementItemProps {
  selectedCard?: any;
  selectedTimeRange: string;
  selectedFormat: string;
  onCardSelect: () => void;
  onTimeRangeChange: (range: string) => void;
  onFormatChange: (format: string) => void;
}

const NewStatementItem: React.FC<NewStatementItemProps> = ({
  selectedCard,
  selectedTimeRange,
  selectedFormat,
  onCardSelect,
  onTimeRangeChange,
  onFormatChange,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <>
      {/* Card Selection */}
      <TouchableOpacity
        style={[styles.cardSelector, { borderColor: colors.outline }]}
        onPress={onCardSelect}
      >
        <View style={styles.cardSelectorLeft}>
          <CustomImage
            source={require('../../../assets/images/SmallCard.png')}
            style={{ width: ms(34), height: ms(24), marginRight: Spacing.m }}
            resizeMode="contain"
          />
          <CustomText type={TextType.CardTitle}>
            {selectedCard?.maskedPan || t('statements.selectCard')}
          </CustomText>
        </View>
        <ChevronSVG width={ms(20)} height={ms(20)} color={colors.primary} />
      </TouchableOpacity>

      {/* Time Period Selection */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timeRangeScroll}
        contentContainerStyle={styles.timeRangeContent}
      >
        {STATEMENT_TIME_RANGES.map((range) => (
          <CustomChip
            key={range}
            label={t(`statements.timeRanges.${range}`)}
            selected={selectedTimeRange === range}
            onPress={() => onTimeRangeChange(range)}
          />
        ))}
      </ScrollView>

      {/* Export Format Selection */}
      <View style={styles.exportSection}>
        <CustomText type={TextType.SectionTitle} style={styles.exportTitle}>
          {t('statements.exportTo')}
        </CustomText>
        {EXPORT_FORMATS.map((format) => (
          <TouchableOpacity
            key={format}
            style={styles.formatItem}
            onPress={() => onFormatChange(format)}
            activeOpacity={0.7}
          >
            <View style={styles.formatLeft}>
              <FileIconSVG width={ms(17)} height={ms(20)} color={colors.primary} />
              <CustomText type={TextType.CardTitle} style={styles.formatLabel}>
                {t(`statements.formats.${format}`)}
              </CustomText>
            </View>
            <CustomRadioButton
              selected={selectedFormat === format}
              onPress={() => onFormatChange(format)}
            />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  timeRangeScroll: {
    marginBottom: Spacing.l,
  },
  timeRangeContent: {
    gap: Spacing.s,
  },
  exportSection: {
    marginTop: Spacing.m,
  },
  exportTitle: {
    marginBottom: Spacing.m,
  },
  formatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  formatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
  },
  formatLabel: {
    textTransform: 'uppercase',
  },
});

export default NewStatementItem;

