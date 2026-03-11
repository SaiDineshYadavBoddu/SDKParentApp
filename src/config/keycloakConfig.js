import Config from 'react-native-config';

export const keycloakConfig = {
  issuer: Config.KEYCLOAK_ISSUER,
  clientId: Config.KEYCLOAK_CLIENT_ID,
  redirectUrl: 'com.keycloakpoc://oauthredirect',
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  dangerouslyAllowInsecureHttpRequests: true,
  /** iOS: false = persistent session, cookies kept (can reduce "open Keycloak" prompt) */
  iosPrefersEphemeralSession: true,
};
