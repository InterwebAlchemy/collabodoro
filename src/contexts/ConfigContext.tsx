import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { WORK_TIME, REST_TIME } from "../constants/time";

// Define the shape of our configuration context
interface ConfigContextType {
  // Configuration values
  workTime: number;
  restTime: number;

  // Update functions
  setWorkTime: (time: number | string) => void;
  setRestTime: (time: number | string) => void;
  resetToDefaults: () => void;

  // Format utilities
  formatTimeInput: (seconds: number) => string;
  parseTimeInput: (input: string) => number;
}

// Define the localStorage keys for our settings
const STORAGE_KEYS = {
  WORK_TIME: "collaborodoro_work_time",
  REST_TIME: "collaborodoro_rest_time",
};

/**
 * Parse a time input string into seconds
 * Supports formats: "30s", "25m", "1h", or plain numbers
 *
 * @param input - The time input string or number to parse
 * @returns The time in seconds
 * @throws Error if the input format is invalid
 */
export const parseTimeInput = (input: string | number): number => {
  // If it's already a number, return it
  if (typeof input === "number") {
    return input;
  }

  // Trim input
  const trimmedInput = input.trim();

  // If it's an empty string, return 0
  if (!trimmedInput) {
    return 0;
  }

  // If it's a plain number, parse it as seconds
  if (!isNaN(Number(trimmedInput)) && /^\d+$/.test(trimmedInput)) {
    return parseInt(trimmedInput, 10);
  }

  // Parse time formats like 30s, 25m, 1h
  const match = trimmedInput.toLowerCase().match(/^(\d+)\s*([smh])$/);
  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case "s":
      case "sec":
      case "seconds":
        return value;
      case "m":
      case "min":
      case "minutes":
        return value * 60;
      case "h":
      case "hr":
      case "hours":
        return value * 3600;
      default:
        return value;
    }
  }

  // If we get here, the format is invalid
  throw new Error(
    `Invalid time format: ${input}. Use format like '25m' or '30s'`
  );
};

/**
 * Format a time in seconds to a user-friendly string
 *
 * @param seconds - The time in seconds
 * @returns A formatted string (e.g., "25m" or "30s")
 */
export const formatTimeInput = (seconds: number): string => {
  if (seconds >= 3600 && seconds % 3600 === 0) {
    return `${seconds / 3600}h`;
  } else if (seconds >= 60 && seconds % 60 === 0) {
    return `${seconds / 60}m`;
  } else {
    return `${seconds}s`;
  }
};

// Create the context with a default value of null
const ConfigContext = createContext<ConfigContextType | null>(null);

/**
 * Provider component for the configuration settings
 * Handles loading from localStorage and provides methods to update settings
 */
export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage or use defaults
  const [workTime, setWorkTimeState] = useState<number>(WORK_TIME);

  const [restTime, setRestTimeState] = useState<number>(REST_TIME);

  // Update workTime and save to localStorage
  const setWorkTime = useCallback((time: number | string) => {
    const timeInSeconds =
      typeof time === "string" ? parseTimeInput(time) : time;
    setWorkTimeState(timeInSeconds);
    localStorage.setItem(STORAGE_KEYS.WORK_TIME, timeInSeconds.toString());
  }, []);

  // Update restTime and save to localStorage
  const setRestTime = useCallback((time: number | string) => {
    const timeInSeconds =
      typeof time === "string" ? parseTimeInput(time) : time;
    setRestTimeState(timeInSeconds);
    localStorage.setItem(STORAGE_KEYS.REST_TIME, timeInSeconds.toString());
  }, []);

  // Reset settings to default values
  const resetToDefaults = useCallback(() => {
    setWorkTime(WORK_TIME);
    setRestTime(REST_TIME);
  }, [setWorkTime, setRestTime]);

  // Create the context value object
  const value: ConfigContextType = {
    workTime,
    restTime,
    setWorkTime,
    setRestTime,
    resetToDefaults,
    formatTimeInput,
    parseTimeInput,
  };

  useEffect(() => {
    if (workTime) {
      const savedWorkTime = localStorage.getItem(STORAGE_KEYS.WORK_TIME);

      setWorkTimeState(savedWorkTime ? parseInt(savedWorkTime, 10) : WORK_TIME);
    }
  }, [workTime]);

  useEffect(() => {
    if (restTime) {
      const savedRestTime = localStorage.getItem(STORAGE_KEYS.REST_TIME);

      setRestTimeState(savedRestTime ? parseInt(savedRestTime, 10) : REST_TIME);
    }
  }, [restTime]);

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

/**
 * Custom hook to access the configuration context
 * @returns {ConfigContextType} The configuration context containing settings and update functions
 * @throws {Error} If used outside of ConfigProvider
 */
export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  return context;
};
