import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { formatDateRange, formatCreationTimestamp } from '../../../utils/transactionUtils';

export interface StatementHistoryItemData {
  id: string;
  requester: string;
  requestedAt: string;
  cardId: string;
  dateFrom: string;
  dateTo: string;
  fileKey: string;
}

interface StatementHistoryItemProps {
  item: StatementHistoryItemData;
  onDownload: (item: StatementHistoryItemData) => void;
}

const StatementHistoryItem: React.FC<StatementHistoryItemProps> = ({ item, onDownload }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const dateRangeText = `(${formatDateRange(item?.dateFrom)} - ${formatDateRange(item?.dateTo)})`;
  const createdText = formatCreationTimestamp(item?.requestedAt);

  return (
    <View style={[styles.historyItem, { borderBottomColor: colors.outline }]}>
      <View style={styles.historyItemLeft}>
        <CustomText type={TextType.CardTitle} style={styles.historyItemTitle}>
          {t('statements.cardStatement')}
        </CustomText>
        <CustomText type={TextType.CardTitle} style={styles.historyItemDateRange}>
          {dateRangeText}
        </CustomText>
        <CustomText type={TextType.CardSubtitle} style={[styles.historyItemCreated, { color: colors.secondaryText }]}>
          {t('statements.created')} {createdText}
        </CustomText>
      </View>
      <TouchableOpacity
        onPress={() => onDownload(item)}
        style={styles.historyDownloadButton}
      >
        <CustomText type={TextType.ActionLabel} style={{ color: colors.primary }}>
          {t('statements.download')}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.l,
    borderBottomWidth: 1,
  },
  historyItemLeft: {
    flex: 1,
    marginRight: Spacing.m,
  },
  historyItemTitle: {
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  historyItemDateRange: {
    marginBottom: Spacing.xs,
  },
  historyItemCreated: {
    fontSize: ms(12),
  },
  historyDownloadButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.s,
  },
});

export default StatementHistoryItem;

