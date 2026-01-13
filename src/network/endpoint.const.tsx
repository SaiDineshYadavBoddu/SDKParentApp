export const API_ENDPOINTS = {
  GET_CARDS: '/api/v1/cards/mine',
  GET_REQUESTS: '/api-approval/api/v1/requests/mine',
  GET_REQUEST_DETAILS: '/api-approval/api/v1/requests',
  GET_REQUEST_TYPES: '/api-approval/api/v1/requests/mine/types',
  GET_USER: '/api/v1/customers/profile',
  GET_USER_ME: '/api/v1/users/me',
  SEND_OTP: '/api-keycloak/auth/realms/Network/otp-token/otp-code',
  VERIFY_OTP: '/api-keycloak/auth/realms/Network/otp-token/verification-code',
  GET_POSTS: '/posts',
  VIEW_POST: '/posts/',
  COMMENT_POST: '/comments/',
  CREATE_SUPPORT_REQUEST: '/api-support/api/v1/support/requests',
  GET_NOTIFICATIONS: '/api-notifications/api/v1/notifications'
} as const;
