import {
  createApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { fetch as sslFetch } from 'react-native-ssl-pinning';
import { getAccessToken } from '../context/AuthContext';
import { expireSession, trySilentRefresh } from '../context/SessionTimeoutContext';
import { Logger } from '../utils/logger';
import { generateTraceparent } from '../utils/tracingUtils';
import { recordActivity, getInactivityMs, INACTIVITY_THRESHOLD_MS } from '../utils/sessionActivity';

const BASE_URL = 'https://sit.corporate.un.infradev.w4.az.network.ae';

const SSL_PINNING_CONFIG = {
  pkPinning: true,
  sslPinning: {
    certs: ['CommercialCards'],
    keyHashes: ['sha256/ltOGk1gdwk6yZGFj5mFS2uBvdSltWivbOYc6z6WpVTE=', 'sha256/ipMRIz6G+i0OtsBSqH1+5XGqbQhUEmvOpv1dJ+vmGDI=', 'sha256/AlSQhgtJirc8ahLyekmtX+Iw+v46yPYRLJt9Cq1GlB0=', 'sha256/C5+lpZ7tcVwmwQIMcRtPbsQtWLABXhQzejna0wHFr8M='],
  },
};

const sslPinnedBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, WebApi, extraOptions) => {
  recordActivity();
  const traceparent = generateTraceparent();

  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : (args.method ?? 'GET');
  const body = typeof args === 'string' ? undefined : args.body;
  const params = typeof args === 'string' ? undefined : args.params;
  const extraHeaders = typeof args === 'string' ? undefined : args.headers;

  let fullUrl = `${BASE_URL}${url}`;
  if (params && typeof params === 'object') {
    const searchParams = Object.entries(params as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    if (searchParams) {
      fullUrl += `?${searchParams}`;
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    traceparent,
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (extraHeaders && typeof extraHeaders === 'object' && !(extraHeaders instanceof Headers)) {
    const entries = Array.isArray(extraHeaders)
      ? extraHeaders
      : Object.entries(extraHeaders);
    for (const [key, value] of entries) {
      if (value !== undefined) {
        headers[key] = value;
      }
    }
  }

  try {
    const response = await sslFetch(fullUrl, {
      method: method as 'GET' | 'POST' | 'PUT' | 'DELETE',
      timeoutInterval: 20000,
      ...SSL_PINNING_CONFIG,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status >= 200 && response.status < 300) {
      let data = null;
      try {
        data = response.bodyString ? JSON.parse(response.bodyString) : null;
      } catch {
        data = response.bodyString ?? null;
      }
      return { data };
    }

    let errorData: unknown;
    try {
      errorData = response.bodyString ? JSON.parse(response.bodyString) : response.bodyString;
    } catch {
      errorData = response.bodyString;
    }

    return {
      error: { status: response.status, data: errorData } as FetchBaseQueryError,
    };
  } catch (err: any) {
    const message = err?.bodyString || err?.message || String(err);

    if (/timeout/i.test(message)) {
      return {
        error: {
          status: 'TIMEOUT_ERROR',
          error: message,
          data: message,
        } as FetchBaseQueryError,
      };
    }

    return {
      error: {
        status: 'FETCH_ERROR',
        error: message,
        data: message,
      } as FetchBaseQueryError,
    };
  }
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await sslPinnedBaseQuery(args, api, extraOptions);

  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : args.method;

  if (result.error && result.error.status === 401) {
    const inactivityMs = getInactivityMs();
    if (inactivityMs < INACTIVITY_THRESHOLD_MS) {
      const refreshed = await trySilentRefresh();
      if (refreshed) {
        return sslPinnedBaseQuery(args, api, extraOptions);
      }
    }
    await expireSession();
  } else if (result.error && result.error.status === 'TIMEOUT_ERROR') {
  } else if (result.error) {
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
