/**
 * Keycloak OAuth config.
 * iOS: iosPrefersEphemeralSession: false keeps cookies in the in-app browser session,
 * so returning to Keycloak can reuse the existing session and may reduce the
 * "NI Commercial wants to open Keycloak" alert when the user is already logged in there.
 */
export const keycloakConfig = {
  issuer:
    'https://keycloak.corporate.un.infradev.w4.az.network.ae/auth/realms/Network/',
  clientId: 'corporate-portal-mobile',
  redirectUrl: 'com.keycloakpoc://oauthredirect',
  scopes: ['openid', 'profile', 'email', 'offline_access'],
  dangerouslyAllowInsecureHttpRequests: true,
  /** iOS: false = persistent session, cookies kept (can reduce "open Keycloak" prompt) */
  iosPrefersEphemeralSession: false,
};
