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
    markAsRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.GET_NOTIFICATIONS}/${id}/mark-as-read`,
        method: 'POST',
      }),
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: `${API_ENDPOINTS.GET_NOTIFICATIONS}/mark-all-as-read`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetNotificationsMutation, useMarkAllAsReadMutation, useMarkAsReadMutation } = notificationApi;
