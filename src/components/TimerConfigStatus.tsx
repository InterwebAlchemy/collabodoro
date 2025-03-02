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

  const { isPeerConnected, isHost, connectedPeerId } = usePeer();

  const isUsingHostSettings =
    isPeerConnected &&
    !isHost &&
    (workTime !== defaultWorkTime || restTime !== defaultRestTime);

  return (
    <div className="flex flex-col text-sm items-center align-center justify-center">
      <div>
        <span className="font-bold">{formatTimeInput(workTime)}</span> /{" "}
        <span className="font-bold">{formatTimeInput(restTime)}</span>
      </div>
      {isUsingHostSettings && (
        <div className="text-xs font-medium text-gray-500">
          {connectedPeerId}
        </div>
      )}
    </div>
  );
}
