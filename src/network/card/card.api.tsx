import { backendApi } from '../api.config';
import { API_ENDPOINTS } from '../endpoint.const';

export const cardApi = backendApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getCards: builder.query<any, any>({
      query: params => ({
        url: API_ENDPOINTS.GET_CARDS,
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useGetCardsQuery } = cardApi;
