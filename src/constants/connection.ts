/**
 * Timeout in milliseconds for peer connection attempts.
 * Shorter in development for faster feedback, longer in production for reliability.
 */
export const CONNECTION_TIMEOUT =
  process.env.NODE_ENV === "development" ? 10000 : 25000;
