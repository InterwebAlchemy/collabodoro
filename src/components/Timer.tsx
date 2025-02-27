"use client";

import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

import TimerWithProgress from "./TimerProgress";
import { WORK_TIME, REST_TIME, TIME_SYNC_INTERVAL } from "../constants/time";
import { WORKING_COLOR, RESTING_COLOR } from "../constants/color";
import { usePeer } from "../contexts/PeerContext";
import { useTimer } from "../contexts/TimerContext";

export interface TimerProps {
  // Optional props for customization if needed
  className?: string;
}

export default function Timer({ className }: TimerProps) {
  const {
    progress,
    setProgress,
    isRunning,
    isPaused,
    onTimerComplete,
    isWorking,
    isResting,
    wasReset,
    handlePause,
  } = useTimer();

  const { sendMessage, isHost } = usePeer();
  const isSynced = !isHost;

  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  const humanizeTime = (seconds: number): React.ReactNode => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const displayHours = `${hours.toString().padStart(2, "0")}`;
    const displayMinutes = `${minutes.toString().padStart(2, "0")}`;
    const displaySeconds = `${remainingSeconds.toString().padStart(2, "0")}`;

    return (
      <div className="flex flex-row items-center justify-center">
        {hours > 0 && (
          <>
            <strong>{displayHours}</strong>
            <span className="text-gray-500">H </span>
          </>
        )}
        {minutes > 0 && (
          <>
            <strong>{displayMinutes}</strong>
            <span className="text-gray-500">M </span>
          </>
        )}
        {remainingSeconds > 0 || isRunning ? (
          <>
            <strong>{displaySeconds}</strong>
            <span className="text-gray-500">S</span>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (isRunning) {
      setProgress(0);
    }
  }, [isRunning, setProgress]);

  useInterval(
    () => {
      setProgress((prev) => prev + 1);

      if (isWorking) {
        if (progress >= WORK_TIME) {
          setProgress(0);
          onTimerComplete();
        }
      } else {
        if (progress >= REST_TIME) {
          setProgress(0);
          onTimerComplete();
        }
      }

      setCurrentTimestamp(Date.now());
    },
    isRunning ? (isPaused ? null : 1000) : null
  );

  useInterval(
    () => {
      // send SYNC message
      sendMessage({
        type: "SYNC",
        payload: {
          isRunning: isRunning,
          isPaused: isPaused,
          progress: progress,
          isWorking: isWorking,
          isResting: isResting,
          timestamp: currentTimestamp,
        },
      });
    },
    !isSynced
      ? isRunning
        ? isPaused
          ? null
          : TIME_SYNC_INTERVAL
        : null
      : null
  );

  const onClick = () => {
    handlePause();
  };

  const renderTimerStatus = () => {
    return (
      <div className="relative flex flex-col justify-center items-center align-center w-full h-full">
        <button
          onClick={onClick}
          className="relatve flex flex-col justify-center items-center align-center w-full h-full appearance-none border-none outline-none"
        >
          <div className="text-4xl font-bold">{humanizeTime(progress)}</div>
          <div className="text-md font-bold text-gray-500 uppercase">
            {isPaused ? (
              "Paused"
            ) : isRunning ? (
              isWorking ? (
                "Working"
              ) : (
                "Resting"
              )
            ) : wasReset ? (
              isWorking ? (
                "Working"
              ) : (
                "Resting"
              )
            ) : (
              <div className="text-4xl font-bold text-white">Collabodoro</div>
            )}
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className={`relative w-full h-[70%] ${className || ""}`}>
      <TimerWithProgress
        progress={isResting ? WORK_TIME : progress}
        max={WORK_TIME}
        color={WORKING_COLOR}
        id="working"
      >
        {!isResting ? (
          <div className="absolute w-[90%] h-[90%]">{renderTimerStatus()}</div>
        ) : (
          <></>
        )}
        <div
          className="absolute w-[90%] h-[90%] opacity-0"
          style={{
            opacity: isResting ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <TimerWithProgress
            progress={isResting ? progress : 0}
            max={REST_TIME}
            color={RESTING_COLOR}
            id="resting"
          >
            {renderTimerStatus()}
          </TimerWithProgress>
        </div>
      </TimerWithProgress>
    </div>
  );
}
