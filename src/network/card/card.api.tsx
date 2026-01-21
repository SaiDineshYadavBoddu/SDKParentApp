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
    getTransactions: builder.query<any, any>({
      query: params => ({
        url: API_ENDPOINTS.GET_TRANSACTIONS,
        method: 'GET',
        params,
      }),
    }),
    getCardLimits: builder.query<any, string>({
      query: cardId => ({
        url: API_ENDPOINTS.GET_CARD_LIMITS.replace('{cardId}', cardId),
        method: 'GET',
      }),
    }),
    getCardRestrictions: builder.query<any, string>({
      query: cardId => ({
        url: API_ENDPOINTS.GET_CARD_RESTRICTIONS.replace('{cardId}', cardId),
        method: 'GET',
      }),
    }),
    closeCard: builder.mutation<any, { cardId: string; body?: any }>({
      query: ({ cardId, body }) => ({
        url: API_ENDPOINTS.POST_CLOSE_CARD.replace('{cardId}', cardId),
        method: 'POST',
        body,
      }),
    }),
    getCardTariffs: builder.query<any, string>({
      query: cardId => ({
        url: API_ENDPOINTS.GET_CARD_TARIFFS.replace('{cardId}', cardId),
        method: 'GET',
      }),
    }),
    replaceCard: builder.mutation<any, { cardId: string; reason: string }>({
      query: ({ cardId, reason }) => ({
        url: `${API_ENDPOINTS.POST_REPLACE_CARD.replace('{cardId}', cardId)}?reason=${reason}`,
        method: 'POST',
      }),
    }),
    blockCard: builder.mutation<any, { cardId: string; reason: string }>({
      query: ({ cardId, reason }) => ({
        url: `${API_ENDPOINTS.POST_BLOCK_CARD.replace('{cardId}', cardId)}?reason=${reason}`,
        method: 'POST',
      }),
    }),
    unblockCard: builder.mutation<any, { cardId: string }>({
      query: ({ cardId }) => ({
        url: API_ENDPOINTS.POST_UNBLOCK_CARD.replace('{cardId}', cardId),
        method: 'POST',
      }),
    }),
    activateCard: builder.mutation<any, { cardId: string; actionToken?: string }>({
      query: ({ cardId, actionToken }) => ({
        url: API_ENDPOINTS.POST_ACTIVATE_CARD.replace('{cardId}', cardId),
        method: 'POST',
        headers: actionToken ? { 'ActionAuthorization': `Bearer ${actionToken}` } : undefined,
        body: {},
      }),
    }),
    getStatements: builder.query<any, { cardId: string; pageSize?: number; pageNumber?: number }>({
      query: params => ({
        url: API_ENDPOINTS.GET_STATEMENTS,
        method: 'GET',
        params,
      }),
    }),
    searchCards: builder.query<any, { ids: string[] }>({
      query: body => ({
        url: API_ENDPOINTS.SEARCH_CARDS,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetCardsQuery, useGetTransactionsQuery, useGetCardLimitsQuery, useGetCardRestrictionsQuery, useCloseCardMutation, useGetCardTariffsQuery, useReplaceCardMutation, useBlockCardMutation, useUnblockCardMutation, useActivateCardMutation, useGetStatementsQuery, useSearchCardsQuery } = cardApi;
