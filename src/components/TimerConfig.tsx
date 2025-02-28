"use client";

import React, { useState, useEffect } from "react";
import { useConfig } from "../contexts/ConfigContext";
import { usePeer } from "../contexts/PeerContext";
import { useTimer } from "../contexts/TimerContext";

/**
 * TimerConfig component allows users to configure work and rest timer durations
 * Changes are persisted to localStorage
 * Supports time inputs like "25m", "30s", etc.
 */
export default function TimerConfig() {
  const {
    workTime,
    restTime,
    setWorkTime,
    setRestTime,
    resetToDefaults,
    formatTimeInput,
    parseTimeInput,
  } = useConfig();

  const { sendMessage } = usePeer();

  const { isRunning, isPaused, isWorking, isResting, progress } = useTimer();

  // Local state for form inputs
  const [workTimeInput, setWorkTimeInput] = useState(formatTimeInput(workTime));
  const [restTimeInput, setRestTimeInput] = useState(formatTimeInput(restTime));
  const [error, setError] = useState<string | null>(null);

  // Update local inputs when context values change
  useEffect(() => {
    setWorkTimeInput(formatTimeInput(workTime));
    setRestTimeInput(formatTimeInput(restTime));
  }, [workTime, restTime, formatTimeInput]);

  // Handle save button click
  const handleSave = () => {
    try {
      setError(null);
      setWorkTime(workTimeInput);
      setRestTime(restTimeInput);

      // send SYNC message to peers
      sendMessage({
        type: "SYNC",
        payload: {
          timestamp: Date.now(),
          workTime: parseTimeInput(workTimeInput),
          restTime: parseTimeInput(restTimeInput),
          progress,
          isRunning,
          isPaused,
          isWorking,
          isResting,
        },
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid time format";
      setError(errorMessage);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    setWorkTimeInput(formatTimeInput(workTime));
    setRestTimeInput(formatTimeInput(restTime));

    // send RESET message to peers
    sendMessage({
      type: "SYNC",
      payload: {
        timestamp: Date.now(),
        workTime: parseTimeInput(workTimeInput),
        restTime: parseTimeInput(restTimeInput),
        progress,
        isRunning,
        isPaused,
        isWorking,
        isResting,
      },
    });
  };

  // Validate input changes
  const validateTimeInput = (input: string): boolean => {
    // Allow empty string during editing
    if (!input.trim()) return true;

    // Check for valid format
    return /^\d+\s*[smh]?$/.test(input);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg bg-background">
      <h2 className="text-lg font-medium">Timer Configuration</h2>

      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="workTime" className="text-sm font-medium">
            Work Duration
          </label>
          <input
            id="workTime"
            type="text"
            value={workTimeInput}
            onChange={(e) => {
              const newValue = e.target.value;
              if (validateTimeInput(newValue)) {
                setWorkTimeInput(newValue);
                setError(null);
              } else {
                setError("Invalid format. Use format like '25m' or '30s'");
              }
            }}
            placeholder="e.g., 25m, 1500s"
            className="p-2 border rounded-md bg-background"
          />
          <p className="text-xs text-muted-foreground">
            Format: 25m (minutes), 30s (seconds), 1h (hours)
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="restTime" className="text-sm font-medium">
            Rest Duration
          </label>
          <input
            id="restTime"
            type="text"
            value={restTimeInput}
            onChange={(e) => {
              const newValue = e.target.value;
              if (validateTimeInput(newValue)) {
                setRestTimeInput(newValue);
                setError(null);
              } else {
                setError("Invalid format. Use format like '5m' or '300s'");
              }
            }}
            placeholder="e.g., 5m, 300s"
            className="p-2 border rounded-md bg-background"
          />
          <p className="text-xs text-muted-foreground">
            Format: 5m (minutes), 30s (seconds), 1h (hours)
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <button
          onClick={handleReset}
          className="px-3 py-1 border rounded-md hover:bg-muted"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
