// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '../context/AuthContext';
import { expireSession } from '../context/SessionTimeoutContext';
import { Logger } from '../utils/logger';
import { generateTraceparent } from '../utils/tracingUtils';


// initialize an empty api service that we'll inject endpoints into later as needed
const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, WebApi, extraOptions) => {
  const traceparent = generateTraceparent();
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: 'https://sit.corporate.un.infradev.w4.az.network.ae',
    prepareHeaders: (headers, { getState: _getState }) => {
      headers.set('Content-Type', 'application/json');
      headers.set('traceparent', traceparent);
      const token = getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    timeout: 10000,
  });

  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : args.method;
  Logger.log(`API Request: [${method}] ${url} | traceparent: ${traceparent}`, typeof args !== 'string' ? args.body : '');

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

  if (result.error && result.error.status === 401) {
    await expireSession();
  } else if (result.error && result.error.status === 'TIMEOUT_ERROR') {
    Logger.error(`API Timeout: [${method}] ${url}`, result.error);
  } else if (result.error) {
    // We no longer navigate globally. Errors must be handled by screens.
    Logger.error(`API Error: [${method}] ${url}`, result.error);
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
  // refetchOnMountOrArgChange: true,
  tagTypes: ['store_details', 'Request'],
  endpoints: () => ({}),
});
