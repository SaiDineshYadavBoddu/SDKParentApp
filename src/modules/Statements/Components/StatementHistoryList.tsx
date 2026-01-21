import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomLoader from '../../../common/components/CustomLoader';
import StatementHistoryItem, { StatementHistoryItemData } from './StatementHistoryItem';
import { useGetStatementsQuery } from '../../../network/card/card.api';

interface StatementHistoryListProps {
  cardId: string;
  onDownload: (item: StatementHistoryItemData) => void;
}

const StatementHistoryList: React.FC<StatementHistoryListProps> = ({ 
  cardId,
  onDownload 
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { data: statementHistory, isLoading } = useGetStatementsQuery(
    {
      cardId,
      pageSize: 20,
      pageNumber: 0,
    },
  );

  return (
      <View style={styles.historyContainer}>
        <FlatList
          data={statementHistory?.content || []}
          renderItem={({ item }) => (
            <StatementHistoryItem item={item} onDownload={onDownload} />
          )}
          keyExtractor={(item) => item?.id.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.historyPlaceholder}>
              <CustomText type={TextType.CardText} style={{ color: colors.secondaryText }}>
                {t('statements.historyPlaceholder')}
              </CustomText>
            </View>
          }
        />
        <CustomLoader loading={isLoading} />
      </View>
      

  );
};

const styles = StyleSheet.create({
  historyContainer: {
    marginTop: Spacing.s,
  },
  historyPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
});

export default StatementHistoryList;

