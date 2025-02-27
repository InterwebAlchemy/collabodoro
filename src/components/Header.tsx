"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IconDeviceDesktopCog,
  IconBulb,
  IconBulbOff,
  IconClockCode,
} from "@tabler/icons-react";
import IconButton from "./IconButton";
import { getThemePreference, setThemePreference, Theme } from "../utils/theme";

/**
 * Header component with theme toggle functionality
 * Displays at the top of the app and allows users to switch between themes
 */
export default function Header() {
  const [theme, setTheme] = useState<Theme>("system");

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
    const nextTheme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

    setTheme(nextTheme);
    setThemePreference(nextTheme);
  };

  return (
    <header className="w-full p-4 flex justify-start items-center">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <IconClockCode color="var(--working-color)" />
        <Link href="/">Collabodoro</Link>
      </h1>
      <IconButton
        buttonClasses="ml-auto"
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
    </header>
  );
}
