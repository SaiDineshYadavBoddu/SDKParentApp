import { backendApi } from "../api.config";
import { API_ENDPOINTS } from "../endpoint.const";

export const cardApi = backendApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Add card-related endpoints here
    // Example:
    // getCards: builder.query<Card[], void>({
    //   query: () => ({
    //     url: API_ENDPOINTS.GET_CARDS,
    //     method: "GET",
    //   }),
    // }),
  }),
});

export const {
  // Export hooks here as endpoints are added
  // Example: useGetCardsQuery,
} = cardApi;

