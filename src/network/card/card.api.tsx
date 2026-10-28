import { backendApi } from '../api.config';
import { API_ENDPOINTS } from '../endpoint.const';
import { getAccessToken } from '../../context/AuthContext';
import { DEMO_ACCESS_TOKEN } from '../../constants/demoAuth';
import { MOCK_CARDS, MOCK_TRANSACTIONS } from '../../constants/mockData';

const isDemoSession = () => getAccessToken() === DEMO_ACCESS_TOKEN;

export const cardApi = backendApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getCards: builder.query<any, any>({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        if (isDemoSession()) {
          return { data: { content: MOCK_CARDS } };
        }
        return baseQuery({
          url: API_ENDPOINTS.GET_CARDS,
          method: 'GET',
          params,
        });
      },
    }),
    getTransactions: builder.query<any, any>({
      async queryFn(params, _api, _extraOptions, baseQuery) {
        if (isDemoSession()) {
          const cardId = (params as any)?.cardId;
          const content = MOCK_TRANSACTIONS.filter(
            item => !cardId || item.cardId === cardId,
          );
          return { data: { content } };
        }
        return baseQuery({
          url: API_ENDPOINTS.GET_TRANSACTIONS,
          method: 'GET',
          params,
        });
      },
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

        const existingContent = currentCache?.content || [];
        // Create a unique key combining refId, date, amount and merchant to prevent data loss
        const getUniqueKey = (item: any) =>
          `${item.transactionRefId || ''}-${item.transactionDate || ''}-${item.amount || 0}-${item.merchantName || ''}`;

        const existingKeys = new Set(existingContent.map(getUniqueKey));
        const uniqueNewContent = newResponse.content.filter((item: any) => !existingKeys.has(getUniqueKey(item)));

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
      }),
    }),
  }),
});

export const { useGetCardsQuery, useGetTransactionsQuery, useGetCardLimitsQuery, useGetCardRestrictionsQuery, useCloseCardMutation, useGetCardTariffsQuery, useReplaceCardMutation, useBlockCardMutation, useUnblockCardMutation, useActivateCardMutation, useGetStatementsQuery, useSearchCardsQuery, useDownloadStatementMutation } = cardApi;
