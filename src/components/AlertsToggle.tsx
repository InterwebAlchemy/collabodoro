"use client";

import { useEffect, useState } from "react";
import { IconBellRinging, IconBellOff } from "@tabler/icons-react";
import IconButton from "./IconButton";
import {
  getAlertsPreference,
  setAlertsPreference,
  AlertsState,
  areNotificationsSupported,
  requestNotificationPermission,
  getNotificationPermission,
  NotificationPermissionState,
} from "../utils/alerts";

/**
 * AlertsToggle component
 * Provides a button to toggle timer alerts on/off
 * @returns An alerts toggle button component
 */
export default function AlertsToggle() {
  const [alertsState, setAlertsState] = useState<AlertsState>("disabled");
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>("default");

  // Calculate the next alerts state in the cycle (enabled -> disabled -> enabled)
  const nextAlertsState = alertsState === "enabled" ? "disabled" : "enabled";

  // Initialize alerts state from localStorage and check notification permission
  useEffect(() => {
    setAlertsState(getAlertsPreference());

    if (areNotificationsSupported()) {
      setNotificationPermission(getNotificationPermission());
    }
  }, []);

  /**
   * Toggle between enabled and disabled alerts
   */
  const toggleAlerts = async () => {
    const newState = nextAlertsState;

    // If enabling alerts, request notification permission
    if (newState === "enabled" && areNotificationsSupported()) {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);

      // Only enable alerts if permission was granted
      if (permission === "granted") {
        setAlertsState("enabled");
        setAlertsPreference("enabled");
      } else {
        // If permission denied, keep alerts disabled and show a message
        setAlertsState("disabled");
        setAlertsPreference("disabled");
        alert(
          "Notifications permission is required to enable alerts. You may need to check your browser's privacy settings to enable websites to request notification permissions."
        );
        return;
      }
    } else {
      // If disabling alerts or notifications not supported
      setAlertsState(newState);
      setAlertsPreference(newState);
    }
  };

  // Determine the status text based on alerts state and notification permission
  const getStatusText = () => {
    if (alertsState === "disabled") return "Disabled";
    if (notificationPermission !== "granted") return "Permission Denied";
    return "Enabled";
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="text-sm text-gray-500 italic">{getStatusText()}</div>
      <IconButton
        onClick={toggleAlerts}
        icon={alertsState === "enabled" ? <IconBellRinging /> : <IconBellOff />}
        label={`${nextAlertsState === "enabled" ? "Enable" : "Disable"} Alerts`}
      />
    </div>
  );
}
