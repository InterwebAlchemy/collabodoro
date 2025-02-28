"use client";

import React from "react";
import { useTimer } from "../contexts/TimerContext";
import { useConfig } from "../contexts/ConfigContext";
import { usePeer } from "../contexts/PeerContext";

/**
 * Displays current active timer configuration and shows if using host settings
 */
export default function TimerConfigStatus() {
  const { workTime, restTime } = useTimer();

  const {
    workTime: defaultWorkTime,
    restTime: defaultRestTime,
    formatTimeInput,
  } = useConfig();

  const { isPeerConnected, isHost } = usePeer();

  const isUsingHostSettings =
    isPeerConnected &&
    !isHost &&
    (workTime !== defaultWorkTime || restTime !== defaultRestTime);

  return (
    <div className="text-sm text-muted-foreground">
      <p>
        Active Timer: {formatTimeInput(workTime)} work /{" "}
        {formatTimeInput(restTime)} rest
        {isUsingHostSettings && (
          <span className="ml-2 text-xs font-medium text-primary">
            (Using host settings)
          </span>
        )}
      </p>
    </div>
  );
}
