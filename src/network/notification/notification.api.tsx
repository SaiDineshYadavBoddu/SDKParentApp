import { backendApi } from '../api.config';
import { API_ENDPOINTS } from '../endpoint.const';
import { NotificationRequestParams, NotificationResponse } from './notification.types';

export const notificationApi = backendApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getNotifications: builder.mutation<NotificationResponse, NotificationRequestParams>({
      query: (params) => ({
        url: API_ENDPOINTS.GET_NOTIFICATIONS,
        method: 'GET',
        params: {
            unreadOnly: params.unreadOnly,
            pageSize: params.pageSize,
            pageNumber: params.pageNumber,
        },
      }),
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: `${API_ENDPOINTS.GET_NOTIFICATIONS}/mark-as-read`,
        method: 'PUT',
      }),
    }),
  }),
});

export const { useGetNotificationsMutation, useMarkAllAsReadMutation } = notificationApi;
