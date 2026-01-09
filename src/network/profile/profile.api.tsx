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
  }),
});

export const { useGetUserDetailsQuery } = profileApi;