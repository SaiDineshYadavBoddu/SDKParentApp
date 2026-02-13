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
      // Consolidate cache keys across pages. Skip pageNumber in key.
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        if (!queryArgs) return endpointName;
        const { pageNumber, ...otherParams } = queryArgs as any;
        return `${endpointName}-${JSON.stringify(otherParams)}`;
      },
      // Merge results and reset when on first page
      merge: (currentCache, newResponse, { arg }) => {
        if (arg && (arg as any).pageNumber === 0) {
          return newResponse;
        }

        // Safety check for currentCache.content
        const existingContent = currentCache?.content || [];
        // Create a Set of existing IDs for O(1) lookup
        const existingIds = new Set(existingContent.map((item: any) => item.id));

        // Filter out incoming items that already exist
        const uniqueNewContent = newResponse.content.filter((item: any) => !existingIds.has(item.id));

        return {
          ...newResponse,
          content: [...existingContent, ...uniqueNewContent],
        };
      },
      // Force cache update on any change
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    searchCards: builder.query<any, { ids: string[] }>({
      query: body => ({
        url: API_ENDPOINTS.SEARCH_CARDS,
        method: 'POST',
        body,
      }),
    }),
    downloadStatement: builder.mutation<any, { statementName: string }>({
      query: ({ statementName }) => ({
        url: API_ENDPOINTS.GET_STATEMENT_DOWNLOAD,
        method: 'GET',
        params: { statementName },
        responseHandler: (response) => response.blob(),
      }),
      transformResponse: async (response: Blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to convert blob to base64'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(response);
        });
      },
    }),
  }),
});

export const { useGetCardsQuery, useGetTransactionsQuery, useGetCardLimitsQuery, useGetCardRestrictionsQuery, useCloseCardMutation, useGetCardTariffsQuery, useReplaceCardMutation, useBlockCardMutation, useUnblockCardMutation, useActivateCardMutation, useGetStatementsQuery, useSearchCardsQuery, useDownloadStatementMutation } = cardApi;
