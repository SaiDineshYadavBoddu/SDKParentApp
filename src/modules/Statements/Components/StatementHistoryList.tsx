import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomLoader from '../../../common/components/CustomLoader';
import StatementHistoryItem, { StatementHistoryItemData } from './StatementHistoryItem';
import { useGetStatementsQuery } from '../../../network/card/card.api';
import CustomErrorView from '../../../common/components/CustomErrorView';

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
  const [pageNumber, setPageNumber] = useState(0);
  const canLoadMore = useRef(false);

  useEffect(() => {
    setPageNumber(0);
  }, [cardId]);

  const { data: statementHistory, isLoading, isError, refetch, isFetching } = useGetStatementsQuery(
    {
      cardId,
      pageSize: 20,
      pageNumber,
    },
  );

  const handleLoadMore = () => {
    if (!canLoadMore.current) return;
    if (!isFetching && !isLoading && !isError && statementHistory && !statementHistory.last) {
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

  return (
    <View style={styles.historyContainer}>
      {isError && !isFetching && pageNumber === 0 ? (
        <CustomErrorView onRetry={refetch} loading={isFetching} />
      ) : (
        <FlatList
          data={statementHistory?.content || []}
          renderItem={({ item }) => (
            <StatementHistoryItem item={item} onDownload={onDownload} />
          )}
          keyExtractor={(item) => item?.id.toString()}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => { canLoadMore.current = true; }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.historyPlaceholder}>
                <CustomText type={TextType.CardText} style={{ color: colors.secondaryText }}>
                  {t('statements.historyPlaceholder')}
                </CustomText>
              </View>
            ) : null
          }
        />
      )}
      {isLoading && pageNumber === 0 && <CustomLoader loading={isLoading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    marginTop: Spacing.s,
  },
  historyPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  footerContainer: {
    paddingVertical: Spacing.m,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.s,
  },
});

export default StatementHistoryList;

