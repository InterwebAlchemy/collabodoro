/**
 * Theme management utility functions
 * Handles theme switching, localStorage persistence, and system preference detection
 */

// Theme options
export type Theme = "light" | "dark" | "system";

// Key for localStorage
const THEME_KEY = "collabodoro-theme";

/**
 * Get the current theme preference from localStorage or system
 * @returns The current theme preference
 */
export const getThemePreference = (): Theme => {
  // Check if we're on the client side
  if (typeof window === "undefined") return "system";

  // Try to get from localStorage
  const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;

  // Return stored preference or default to system
  return storedTheme || "system";
};

/**
 * Set the theme preference and store in localStorage
 * @param theme - The theme to set
 */
export const setThemePreference = (theme: Theme): void => {
  if (typeof window === "undefined") return;

  // Store the preference
  localStorage.setItem(THEME_KEY, theme);

  // Apply the theme to the document
  applyTheme(theme);
};

/**
 * Apply the selected theme to the document
 * @param theme - The theme to apply
 */
export const applyTheme = (theme: Theme): void => {
  if (typeof window === "undefined") return;

  // Determine if dark mode should be applied
  const isLight =
    theme === "light" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: light)").matches);

  // Apply or remove the light class to the document
  document.documentElement.classList.toggle("light-mode", isLight);
};

/**
 * Initialize the theme based on stored preference or system preference
 * Should be called on initial client-side load
 */
export const initializeTheme = (): void => {
  if (typeof window === "undefined") return;

  // Get the current preference
  const currentTheme = getThemePreference();

  // Apply it
  applyTheme(currentTheme);

  // Set up listener for system preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  mediaQuery.addEventListener("change", () => {
    if (getThemePreference() === "system") {
      applyTheme("system");
    }
  });
};
