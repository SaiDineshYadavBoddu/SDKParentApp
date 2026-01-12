import { backendApi } from '../api.config';
import { API_ENDPOINTS } from '../endpoint.const';

export interface SendOtpParams {
  type: 'PHONE' | 'EMAIL';
}

export interface VerifyOtpParams {
  code: string;
  type: 'PHONE' | 'EMAIL';
}

export interface SendOtpResponse {
  expiresIn: number;
  tryAgainIn: number;
  sentTo: string;
}

export const otpApi = backendApi.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    sendOtpToken: builder.mutation<SendOtpResponse, SendOtpParams>({
      query: ({ type }) => ({
        url: `${API_ENDPOINTS.SEND_OTP}?type=${type}`,
        method: 'GET',
      }),
    }),
    verifyOtpToken: builder.mutation<void, VerifyOtpParams>({
      query: (body) => ({
        url: API_ENDPOINTS.VERIFY_OTP,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useSendOtpTokenMutation,
  useVerifyOtpTokenMutation,
} = otpApi;
