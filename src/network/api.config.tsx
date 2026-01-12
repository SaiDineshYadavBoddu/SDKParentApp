// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { AppConfig } from '../config/appConfig';
import { getAccessToken } from '../context/AuthContext';
import { Logger } from '../utils/logger';

// initialize an empty api service that we'll inject endpoints into later as needed
const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, WebApi, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: 'https://sit.corporate.un.infradev.w4.az.network.ae/api/v1',
    prepareHeaders: (headers, { getState: _getState }) => {
      headers.set('Content-Type', 'application/json');
      const token = getAccessToken();
      // Logger.log('🚀 ~ dynamicBaseQuery ~ token:', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : args.method;
  Logger.log(`API Request: [${method}] ${url}`, typeof args !== 'string' ? args.body : '');

  return rawBaseQuery(args, WebApi, extraOptions);
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await dynamicBaseQuery(args, api, extraOptions);

  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : args.method;
  Logger.log(`API Response: [${method}] ${url}`, result);

  if (result.error && result.error?.status === 'FETCH_ERROR') {
    Logger.error('Something went wrong. Please try again!', result.error);
    return result;
  }
  if (result.error && result.error.status === 401) {
    // try to get a new token
  } else if (result.error && result.error.status === 400) {
    // Show global toast only if not ignored
    Logger.warn(result.error?.data || 'Something went wrong.');
  } else if (result.error && result.error.status === 500) {
    // try to get a new token
    Logger.error('Something went wrong.', result.error);
  }
  return result;
};

export const backendApi = createApi({
  reducerPath: 'backend',
  // extractRehydrationInfo(action, { reducerPath }) {
  //   if (action.type === REHYDRATE) {
  //     return action.payload[reducerPath];
  //   }
  // },
  baseQuery: baseQueryWithReauth,
  // refetchOnMountOrArgChange: 30,
  tagTypes: ['store_details'],
  endpoints: () => ({}),
});
