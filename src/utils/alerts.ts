/**
 * Timer alerts management utility functions
 * Handles alerts toggling and localStorage persistence
 */

// Alerts options
export type AlertsState = "enabled" | "disabled";
export type NotificationPermissionState =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

// Key for localStorage
const ALERTS_KEY = "collabodoro-alerts";

/**
 * Get the current alerts preference from localStorage
 * @returns The current alerts preference
 */
export const getAlertsPreference = (): AlertsState => {
  // Check if we're on the client side
  if (typeof window === "undefined") return "disabled";

  // Try to get from localStorage
  const storedAlertsState = localStorage.getItem(
    ALERTS_KEY
  ) as AlertsState | null;

  // Return stored preference or default to disabled
  return storedAlertsState || "disabled";
};

/**
 * Set the alerts preference and store in localStorage
 * @param alertsState - The alerts state to set
 */
export const setAlertsPreference = (alertsState: AlertsState): void => {
  if (typeof window === "undefined") return;

  // Store the preference
  localStorage.setItem(ALERTS_KEY, alertsState);
};

/**
 * Check if browser notifications are supported
 * @returns True if notifications are supported, false otherwise
 */
export const areNotificationsSupported = (): boolean => {
  return typeof window !== "undefined" && "Notification" in window;
};

/**
 * Send a browser notification if alerts are enabled and permission is granted
 * @param title - The notification title
 * @param options - Additional notification options
 * @returns True if notification was sent, false otherwise
 */
export const sendNotification = (
  title: string,
  options?: NotificationOptions
): boolean => {
  // Check if notifications are supported and enabled
  if (!areNotificationsSupported()) return false;

  // Check if alerts are enabled
  if (getAlertsPreference() !== "enabled") return false;

  // Check if we have permission
  if (Notification.permission !== "granted") return false;

  try {
    console.log("sending notification", title, options);
    // Send the notification
    const notification = new Notification(title, options);

    setTimeout(() => {
      notification.close();
    }, 5000);

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

/**
 * Get the current notification permission state
 * @returns The current notification permission state
 */
export const getNotificationPermission = (): NotificationPermissionState => {
  if (!areNotificationsSupported()) return "unsupported";
  return Notification.permission as NotificationPermissionState;
};

/**
 * Request notification permission from the user
 * @returns A promise that resolves to the permission state
 */
export const requestNotificationPermission =
  async (): Promise<NotificationPermissionState> => {
    if (!areNotificationsSupported()) return "unsupported";

    try {
      const permission = await Notification.requestPermission();
      return permission as NotificationPermissionState;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  };

/**
 * Initialize the alerts based on stored preference
 * Should be called on initial client-side load
 */
export const initializeAlerts = (): AlertsState => {
  if (typeof window === "undefined") return "disabled";

  // Get and return the current preference
  return getAlertsPreference();
};
