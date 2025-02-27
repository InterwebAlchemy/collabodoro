"use client";

import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

import TimerWithProgress from "./TimerProgress";
import { WORK_TIME, REST_TIME, TIME_SYNC_INTERVAL } from "../constants/time";
import { WORKING_COLOR, RESTING_COLOR } from "../constants/color";
import { usePeer } from "../contexts/PeerContext";

export interface TimerProps {
  shouldRun?: boolean;
  isPaused?: boolean;
  progress?: number;
  onPause?: () => void;
  setProgress?: React.Dispatch<React.SetStateAction<number>>;
  onTimerComplete?: () => void;
  isWorking?: boolean;
  isResting?: boolean;
  isSynced?: boolean;
  wasReset?: boolean;
}

export default function Timer({
  shouldRun = false,
  isPaused = false,
  progress = 0,
  setProgress = () => {},
  onPause = () => {},
  onTimerComplete = () => {},
  isWorking = true,
  isResting = false,
  isSynced = false,
  wasReset = false,
}: TimerProps) {
  const { sendMessage } = usePeer();

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
        {remainingSeconds > 0 || shouldRun ? (
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
    if (shouldRun) {
      setProgress(0);
    }
  }, [shouldRun]);

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
    shouldRun ? (isPaused ? null : 1000) : null
  );

  useInterval(
    () => {
      // send SYNC message
      sendMessage({
        type: "SYNC",
        payload: {
          isRunning: shouldRun,
          isPaused: isPaused,
          progress: progress,
          isWorking: isWorking,
          isResting: isResting,
          timestamp: currentTimestamp,
        },
      });
    },
    !isSynced
      ? shouldRun
        ? isPaused
          ? null
          : TIME_SYNC_INTERVAL
        : null
      : null
  );

  const onClick = () => {
    onPause?.();
  };

  const renderTimerStatus = () => {
    return (
      <div className="flex flex-col justify-center items-center align-center w-full h-full">
        <div className="text-4xl font-bold">{humanizeTime(progress)}</div>
        <div className="text-md text-gray-500 uppercase">
          {isPaused ? (
            "Paused"
          ) : shouldRun ? (
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
      </div>
    );
  };

  return (
    <div className="relative w-full h-[70%]">
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
        <button
          onClick={onClick}
          className="w-full h-full relative appearance-none border-none outline-none"
        ></button>
      </TimerWithProgress>
    </div>
  );
}
