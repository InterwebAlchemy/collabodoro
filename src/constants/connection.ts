/**
 * Timeout in milliseconds for peer connection attempts.
 * Shorter in development for faster feedback, longer in production for reliability.
 */
export const CONNECTION_TIMEOUT =
  process.env.NODE_ENV === "development" ? 10000 : 25000;

export const GOOGLE_STUN_SERVER = "stun:stun.l.google.com:19302";
export const TWILIO_STUN_SERVER = "stun:global.stun.twilio.com:3478";

export const STUN_SERVERS = [
  { urls: GOOGLE_STUN_SERVER },
  { urls: TWILIO_STUN_SERVER },
];
