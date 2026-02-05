import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomHeader from '../../../common/components/CustomHeader';
import CustomText, { TextType } from '../../../common/components/CustomText';
import NotificationItem from '../Components/NotificationItem';
import CustomErrorView from '../../../common/components/CustomErrorView';
import RequestTimeoutScreen from '../../../common/components/RequestTimeoutScreen';
import RequestDetailBottomSheet from '../../Requests/Components/RequestDetailBottomSheet';
import {
  useGetNotificationsMutation,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from '../../../network/notification/notification.api';
import { useCancelRequestMutation } from '../../../network/requests/request.api';
import { NotificationItem as NotificationType } from '../../../network/notification/notification.types';
import { RequestItem } from '../../../network/requests/request.types';
import SuccessSVG from '../../../assets/svgs/SuccessSVG';

const NotificationsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isTimeoutError, setIsTimeoutError] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(
    null,
  );

  const [getNotifications, { isLoading }] = useGetNotificationsMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [cancelRequest, { isLoading: isCancelling }] = useCancelRequestMutation();

  const [showCancelRequestError, setShowCancelRequestError] = useState(false);

  useEffect(() => {
    fetchNotifications(0);
  }, []);

  const fetchNotifications = async (pageNumber: number) => {
    if (isLoading) return;

    try {
      setHasError(false);
      setIsTimeoutError(false);
      const response = await getNotifications({
        unreadOnly: false,
        pageSize: 10,
        pageNumber: pageNumber,
      }).unwrap();

      if (pageNumber === 0) {
        setNotifications(response.content);
      } else {
        setNotifications(prev => [...prev, ...response.content]);
      }

      setHasMore(!response.last);
      setPage(pageNumber);
    } catch (error: any) {
      console.error('Failed to fetch notifications', error);
      if (error?.status === 'TIMEOUT_ERROR') {
        setIsTimeoutError(true);
      } else {
        setHasError(true);
      }
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id).unwrap();
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const groupedNotifications = useMemo(() => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const groups: { [key: string]: NotificationType[] } = {
      Today: [],
      Yesterday: [],
      ThisWeek: [],
      Past: [],
    };

    notifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      if (date.toDateString() === today.toDateString()) {
        groups.Today.push(notification);
      } else if (date.toDateString() === yesterday.toDateString()) {
        groups.Yesterday.push(notification);
      } else if (today.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
        groups.ThisWeek.push(notification);
      } else {
        groups.Past.push(notification);
      }
    });

    return Object.keys(groups)
      .filter(key => groups[key].length > 0)
      .map(key => ({
        title: key,
        data: groups[key],
      }));
  }, [notifications]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore && !hasError) {
      fetchNotifications(page + 1);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    try {
      await cancelRequest(requestId).unwrap();
      setSelectedRequest(null);
      setShowCancelRequestError(false);
      (navigation as any).navigate('GenericInfoScreen', {
          title: 'requests.cancelSuccessTitle',
          description: 'requests.cancelSuccessDescription',
          primaryButton: {
              title: 'common.done',
              onPress: async () => {
                  (navigation as any).goBack();
                  fetchNotifications(0); 
              }
          },
          icon: <SuccessSVG />
      });
    } catch (error) {
       console.error('Failed to cancel request in Notifications', error);
       setShowCancelRequestError(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={t('notifications.title')}
        onBackPress={() => navigation.goBack()}
      />

      {isTimeoutError ? (
        <RequestTimeoutScreen onRetry={() => fetchNotifications(0)} />
      ) : hasError ? (
        <CustomErrorView
          onRetry={() => fetchNotifications(0)}
          loading={isLoading}
        />
      ) : (
        <SectionList
          sections={groupedNotifications}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onViewRequest={() => {
                if (!item.isRead) {
                  handleMarkAsRead(item.id);
                }
                setSelectedRequest({
                  id: item.subjectId,
                } as unknown as RequestItem);
              }}
              onViewCard={() => {
                if (!item.isRead) {
                  handleMarkAsRead(item.id);
                }
                if (item.subjectId) {
                  (navigation as any).reset({
                    index: 0,
                    routes: [
                      {
                        name: 'BottomTabs',
                        params: {
                          screen: 'My Cards',
                          params: { cardId: item.subjectId },
                          cardId: item.subjectId,
                        },
                      },
                    ],
                  });
                }
              }}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <CustomText type={TextType.Label} style={{ fontWeight: '700' }}>
                {t(`notifications.sections.${title}`)}
              </CustomText>
              {title === 'Today' && (
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                  <CustomText
                    type={TextType.ScreenDisplaySmall}
                    style={{ color: colors.primary, fontWeight: '600' }}
                  >
                    {t('notifications.markAllAsRead')}
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading ? (
              <ActivityIndicator style={{ margin: Spacing.m }} />
            ) : hasError && notifications.length > 0 ? (
              <TouchableOpacity
                onPress={() => fetchNotifications(page + 1)}
                style={styles.retryFooter}
              >
                <CustomText
                  type={TextType.ScreenDisplaySmall}
                  style={{ color: colors.primary }}
                >
                  {t('notifications.errors.loadMoreFailed')}
                </CustomText>
              </TouchableOpacity>
            ) : null
          }
          ListEmptyComponent={
            !isLoading && !hasError && notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <CustomText type={TextType.Label}>
                  {t('notifications.empty')}
                </CustomText>
              </View>
            ) : null
          }
          stickySectionHeadersEnabled={false}
        />
      )}

      <RequestDetailBottomSheet
        visible={!!selectedRequest}
        onClose={() => {
          setSelectedRequest(null); 
          setShowCancelRequestError(false);
        }}
        request={selectedRequest}
        onCancelRequest={() => selectedRequest && handleCancelRequest(String(selectedRequest.id))}
        isCancelling={isCancelling}
        showCancelRequestError={showCancelRequestError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.l,
    marginBottom: Spacing.m,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: ms(100),
  },
  retryButton: {
    padding: Spacing.m,
    borderWidth: 1,
    borderRadius: ms(8),
  },
  retryFooter: {
    padding: Spacing.m,
    alignItems: 'center',
  },
});

export default NotificationsScreen;
