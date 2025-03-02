/**
 * Timer direction management utility functions
 * Handles direction switching and localStorage persistence
 */

// Direction options
export type Direction = "countUp" | "countDown";

// Key for localStorage
const DIRECTION_KEY = "collabodoro-direction";

/**
 * Get the current direction preference from localStorage
 * @returns The current direction preference
 */
export const getDirectionPreference = (): Direction => {
  // Check if we're on the client side
  if (typeof window === "undefined") return "countDown";

  // Try to get from localStorage
  const storedDirection = localStorage.getItem(
    DIRECTION_KEY
  ) as Direction | null;

  // Return stored preference or default to countDown
  return storedDirection || "countDown";
};

/**
 * Set the direction preference and store in localStorage
 * @param direction - The direction to set
 */
export const setDirectionPreference = (direction: Direction): void => {
  if (typeof window === "undefined") return;

  // Store the preference
  localStorage.setItem(DIRECTION_KEY, direction);
};

/**
 * Initialize the direction based on stored preference
 * Should be called on initial client-side load
 */
export const initializeDirection = (): Direction => {
  if (typeof window === "undefined") return "countDown";

  // Get and return the current preference
  return getDirectionPreference();
};
