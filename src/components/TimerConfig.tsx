"use client";

import React, { useState, useEffect } from "react";
import { IconClockEdit, IconTimeDurationOff } from "@tabler/icons-react";

import { useConfig } from "../contexts/ConfigContext";
import { usePeer } from "../contexts/PeerContext";
import { useTimer } from "../contexts/TimerContext";
import IconButton from "./IconButton";

/**
 * TimerConfig component allows users to configure work and rest timer durations
 * Changes are persisted to localStorage
 * Supports time inputs like "25m", "30s", etc.
 */
export default function TimerConfig({ children }: React.PropsWithChildren) {
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
    <>
      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center">
          <div className="flex flex-col gap-1">
            <label htmlFor="workTime" className="text-md font-bold">
              Pomodoro
            </label>
            <div className="text-xs text-gray-500">5m, 30s, 1h, etc.</div>
          </div>
          <div className="flex flex-row gap-2 items-center justify-end ml-auto">
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
                  setError('Please use a time format like "25m", "30s", etc.');
                }
              }}
              placeholder="25m"
              className="w-[52px] p-2 border border-foreground rounded-md bg-background ml-auto text-right text-md transition-colors duration-1000 ease"
            />
            <div className="text-muted-foreground">/</div>
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
                  setError('Please use a time format like "5m", "5s", etc.');
                }
              }}
              placeholder="5m"
              className="w-[52px] p-2 border border-foreground rounded-md bg-background ml-auto text-right text-md transition-colors duration-1000 ease"
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center justify-end">
          <IconButton
            buttonClasses="p-1 mr-auto"
            labelClasses="text-xs"
            onClick={handleReset}
            icon={<IconTimeDurationOff size={12} />}
            label="Reset"
            showLabel
          />
          <IconButton
            buttonClasses="p-1"
            labelClasses="text-xs"
            onClick={handleSave}
            icon={<IconClockEdit size={12} />}
            label="Update"
            showLabel
          />
        </div>
      </div>

      {children}

      <div className="flex justify-between mt-2">
        <button
          onClick={handleReset}
          className="px-3 py-1 border rounded-md hover:bg-muted"
        >
          Reset to Defaults
        </button>
      </div>
    </>
  );
}
