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
import { formatMaskedCardNumber, getCardImage } from '../../../utils/cardUtils';
import ChevronDownSVG from '../../../assets/svgs/CheveronDownSVG';
import { STATEMENTS_TIME_RANGES } from '../../../constants/appConstants';

const EXPORT_FORMATS = [
  { label: 'statements.formats.csv', value: 'csv' },
  { label: 'statements.formats.excel', value: 'excel' },
  { label: 'statements.formats.pdf', value: 'pdf' },
  { label: 'statements.formats.word', value: 'word' },
];

interface NewStatementItemProps {
  selectedCard?: any;
  selectedTimeRange: string;
  selectedFormat: string;
  onCardSelect?: () => void;
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

  const cardDisplay = (
    <View style={[styles.cardSelector, { borderColor: colors.outline }]}>
      <View style={styles.cardSelectorLeft}>
        <CustomImage
          source={getCardImage(selectedCard?.product)}
          style={{ width: ms(34), height: ms(24), marginRight: Spacing.m }}
          resizeMode="contain"
        />
        <CustomText type={TextType.CardTitle}>
          {selectedCard?.maskedPan ? formatMaskedCardNumber(selectedCard.maskedPan) : t('statements.selectCard')}
        </CustomText>
      </View>
      {onCardSelect ? <ChevronDownSVG width={ms(20)} height={ms(20)} stroke={colors.primary} /> : null}
    </View>
  );

  return (
    <>
      {/* Card (selected from Transactions screen – no dropdown) */}
      {onCardSelect ? (
        <TouchableOpacity onPress={onCardSelect} activeOpacity={0.7}>
          {cardDisplay}
        </TouchableOpacity>
      ) : (
        cardDisplay
      )}

      {/* Time Period Selection */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.timeRangeScroll}
        contentContainerStyle={styles.timeRangeContent}
      >
        {STATEMENTS_TIME_RANGES.map((range) => (
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
        {EXPORT_FORMATS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={styles.formatItem}
            onPress={() => onFormatChange(item.value)}
            activeOpacity={0.7}
          >
            <View style={styles.formatLeft}>
              <FileIconSVG width={ms(17)} height={ms(20)} color={colors.primary} />
              <CustomText type={TextType.CardTitle} style={styles.formatLabel}>
                {t(item.label)}
              </CustomText>
            </View>
            <CustomRadioButton
              selected={selectedFormat === item.value}
              onPress={() => onFormatChange(item.value)}
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
    gap: Spacing.xl
  },
  exportTitle: {
    // marginBottom: Spacing.m,
  },
  formatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingVertical: Spacing.l,
    // borderBottomWidth: 1,
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

