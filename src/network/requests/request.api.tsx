import { backendApi } from '../api.config';
import { API_ENDPOINTS } from '../endpoint.const';
import { RequestItem } from './request.types';

export const requestApi = backendApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getRequests: builder.query<
      {
        content: RequestItem[];
        last: boolean;
        totalPages: number;
        totalElements: number;
        size: number;
        number: number;
        first: boolean;
        empty: boolean;
      },
      {
        status?: string;
        actionType?: string;
        startDate?: string;
        endDate?: string;
        pageNumber?: number;
        pageSize?: number;
        sortProperty?: string;
        sortDirection?: string;
        search?: string;
      } | void
    >({
      query: params => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(v => {
                if (v !== undefined && v !== null && v !== '') {
                  queryParams.append(key, v.toString());
                }
              });
            } else if (value !== undefined && value !== null && value !== '') {
              queryParams.append(key, value.toString());
            }
          });
        }
        const queryString = queryParams.toString();
        return {
          url: queryString
            ? `${API_ENDPOINTS.GET_REQUESTS}?${queryString}`
            : API_ENDPOINTS.GET_REQUESTS,
          method: 'GET',
        };
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
        
        // Safety check for currentCache.content
        const existingContent = currentCache?.content || [];
        // Create a Set of existing IDs for O(1) lookup
        const existingIds = new Set(existingContent.map(item => item.id));
        
        // Filter out incoming items that already exist
        const uniqueNewContent = newResponse.content.filter(item => !existingIds.has(item.id));

        return {
          ...newResponse,
          content: [...existingContent, ...uniqueNewContent],
        };
      },
      // Force cache update on any change
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: ['Request'],
    }),
    getRequestTypes: builder.query<any, void>({
      query: () => {
        return {
          url: API_ENDPOINTS.GET_REQUEST_TYPES,
          method: 'GET',
        };
      },
    }),
    getRequestById: builder.query<any, string | number>({
      query: id => {
        return {
          url: `${API_ENDPOINTS.GET_REQUEST_DETAILS}/${id}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, arg) => [{ type: 'Request', id: arg }],
    }),
    cancelRequest: builder.mutation<any, string | number>({
      query: (requestId: string) => {
        return {
          url: API_ENDPOINTS.POST_CANCEL_REQUEST.replace('{requestId}', requestId),
          method: 'POST',
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Request', id: arg }, 'Request'],
    }),
    retryRequest: builder.mutation<any, string | number>({
      query: (requestId: string) => {
        return {
          url: API_ENDPOINTS.POST_RETRY_REQUEST.replace('{requestId}', requestId),
          method: 'POST',
        };
      },
      invalidatesTags: (result, error, arg) => [{ type: 'Request', id: arg }, 'Request'],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useLazyGetRequestsQuery,
  useGetRequestTypesQuery,
  useGetRequestByIdQuery,
  useLazyGetRequestByIdQuery,
  useCancelRequestMutation,
  useRetryRequestMutation,
} = requestApi;