/**
 * Callback for when SSL/certificate pinning fails (Android: "Certificate pinning failure!",
 * iOS: "The certificate for this server is invalid"). The root navigator registers a
 * handler that shows the SSL error screen; the API layer calls reportSslPinningFailure().
 */
let onSslPinningFailure: (() => void) | null = null;

export const setSslPinningFailureHandler = (handler: (() => void) | null) => {
  onSslPinningFailure = handler;
};

export const reportSslPinningFailure = () => {
  onSslPinningFailure?.();
};

export const isSslPinningError = (message: string): boolean => {
  const normalized = message.trim();
  return (
    /Certificate pinning failure!/i.test(normalized) ||
    /The certificate for this server is invalid/i.test(normalized) ||
    /^cancelled$/i.test(normalized)
  );
};
