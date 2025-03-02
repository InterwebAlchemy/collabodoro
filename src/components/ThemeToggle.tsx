"use client";

import { useEffect, useState } from "react";
import {
  IconDeviceDesktopCog,
  IconBulb,
  IconBulbOff,
} from "@tabler/icons-react";
import IconButton from "./IconButton";
import { getThemePreference, setThemePreference, Theme } from "../utils/theme";

/**
 * ThemeToggle component
 * Provides a button to toggle between light, dark, and system themes
 * @returns A theme toggle button component
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  // Calculate the next theme in the cycle (light -> dark -> system -> light)
  const nextTheme =
    theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  // Initialize theme state from localStorage or system preference
  useEffect(() => {
    setTheme(getThemePreference());
  }, []);

  /**
   * Toggle between light, dark, and system themes
   */
  const toggleTheme = () => {
    setTheme(nextTheme);
    setThemePreference(nextTheme);
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="text-sm text-gray-500 italic">
        {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}
      </div>
      <IconButton
        onClick={toggleTheme}
        icon={
          theme === "light" ? (
            <IconBulb />
          ) : theme === "dark" ? (
            <IconBulbOff />
          ) : (
            <IconDeviceDesktopCog />
          )
        }
        label={`Switch to ${nextTheme} color scheme`}
      />
    </div>
  );
}
