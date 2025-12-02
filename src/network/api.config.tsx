// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { AppConfig } from "../config/appConfig";

// initialize an empty api service that we'll inject endpoints into later as needed
const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, WebApi, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: AppConfig.BASE_URL || "https://jsonplaceholder.typicode.com",
    prepareHeaders: (headers, { getState: _getState }) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  });
  return rawBaseQuery(args, WebApi, extraOptions);
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await dynamicBaseQuery(args, api, extraOptions);
  console.log("🚀 ~ baseQueryWithReauth ~ result:", result);

  if (result.error && result.error?.status === "FETCH_ERROR") {
    console.log("Something went wrong. Please try again!", result.error);
    return result;
  }
  if (result.error && result.error.status === 401) {
    // try to get a new token
  } else if (result.error && result.error.status === 400) {
    // Show global toast only if not ignored
    console.log(
        result.error?.data ||
        "Something went wrong."
    );
  } else if (result.error && result.error.status === 500) {
    // try to get a new token
    console.log("Something went wrong.", result.error);
  }
  return result;
};

export const backendApi = createApi({
  reducerPath: "backend",
  // extractRehydrationInfo(action, { reducerPath }) {
  //   if (action.type === REHYDRATE) {
  //     return action.payload[reducerPath];
  //   }
  // },
  baseQuery: baseQueryWithReauth,
  // refetchOnMountOrArgChange: 30,
  tagTypes: ["store_details"],
  endpoints: () => ({}),
});

