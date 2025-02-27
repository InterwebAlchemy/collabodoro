"use client";

import { useEffect } from "react";
import { initializeTheme } from "../utils/theme";

/**
 * ThemeProvider initializes theme settings on client-side mount
 * This prevents flash of wrong theme by setting theme class as early as possible
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize theme based on localStorage or system preference
    initializeTheme();
  }, []);

  return <>{children}</>;
}
