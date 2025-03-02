/**
 * Timer sounds management utility functions
 * Handles sounds toggling and localStorage persistence
 */

// Sounds options
export type SoundsState = "enabled" | "disabled";

// Key for localStorage
const SOUNDS_KEY = "collabodoro-sounds";

// Custom event for sound preference changes
export const SOUNDS_CHANGE_EVENT = "collabodoro-sounds-change";

/**
 * Get the current sounds preference from localStorage
 * @returns The current sounds preference
 */
export const getSoundsPreference = (): SoundsState => {
  // Check if we're on the client side
  if (typeof window === "undefined") return "disabled";

  // Try to get from localStorage
  const storedSoundsState = localStorage.getItem(
    SOUNDS_KEY
  ) as SoundsState | null;

  // Return stored preference or default to disabled
  return storedSoundsState || "disabled";
};

/**
 * Set the sounds preference and store in localStorage
 * @param soundsState - The sounds state to set
 */
export const setSoundsPreference = (soundsState: SoundsState): void => {
  if (typeof window === "undefined") return;

  // Store the preference
  localStorage.setItem(SOUNDS_KEY, soundsState);

  // Dispatch a custom event so other components can react to the change
  const event = new CustomEvent(SOUNDS_CHANGE_EVENT, {
    detail: { soundsState },
  });
  window.dispatchEvent(event);
};

/**
 * Initialize the sounds based on stored preference
 * Should be called on initial client-side load
 */
export const initializeSounds = (): SoundsState => {
  if (typeof window === "undefined") return "disabled";

  // Get and return the current preference
  return getSoundsPreference();
};
