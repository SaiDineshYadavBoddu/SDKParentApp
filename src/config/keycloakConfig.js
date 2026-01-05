export const keycloakConfig = {
  issuer:
    'https://keycloak.corporate.un.infradev.w4.az.network.ae/auth/realms/Network/',
  clientId: 'corporate-portal-mobile',
  redirectUrl: 'com.keycloakpoc://oauthredirect',
  scopes: ['openid', 'profile', 'email'],
  dangerouslyAllowInsecureHttpRequests: true,
};
