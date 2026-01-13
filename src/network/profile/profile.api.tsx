import { backendApi } from '../api.config';
import { API_ENDPOINTS } from '../endpoint.const';

export const profileApi = backendApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getUserDetails: builder.query<any, void>({
      query: () => ({
        url: API_ENDPOINTS.GET_USER,
        method: 'GET',
      }),
    }),
    createSupportRequest: builder.mutation<any, { phoneNumber: string; topic: string; description: string }>({
      query: (body) => ({
        url: API_ENDPOINTS.CREATE_SUPPORT_REQUEST,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetUserDetailsQuery, useCreateSupportRequestMutation } = profileApi;