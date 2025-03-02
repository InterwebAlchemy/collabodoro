"use client";

import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

import TimerWithProgress from "./TimerProgress";
import { TIME_SYNC_INTERVAL } from "../constants/time";
import { usePeer } from "../contexts/PeerContext";
import { useTimer } from "../contexts/TimerContext";
import { useConfig } from "../contexts/ConfigContext";

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
    workTime,
    restTime,
  } = useTimer();

  const { sendMessage, isHost, isJoining, isConnected } = usePeer();

  const { parseTimeInput, formatTimeInput, direction } = useConfig();

  const isSynced = !isHost;

  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  const humanizeTime = (seconds: number): React.ReactNode => {
    // For countDown mode, display the remaining time instead of elapsed time
    const displayTime =
      direction === "countUp"
        ? seconds
        : isWorking
        ? workTime - seconds
        : restTime - seconds;

    const hours = Math.floor(displayTime / 3600);
    const minutes = Math.floor((displayTime % 3600) / 60);
    const remainingSeconds = displayTime % 60;

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
        {isRunning ? (
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
        if (progress >= workTime) {
          setProgress(0);
          onTimerComplete();
        }
      } else {
        if (progress >= restTime) {
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

  const onDoubleClick = () => {
    const newProgress = window.prompt(
      "Enter the new progress value. Use 25s, 30m, etc. format."
    );

    if (newProgress) {
      try {
        const parsedProgress = parseTimeInput(newProgress);

        if (parsedProgress) {
          if (parsedProgress > workTime) {
            window.alert(
              `Progress cannot be greater than ${
                isWorking ? "working" : "resting"
              } time: ${formatTimeInput(isWorking ? workTime : restTime)}`
            );
          } else {
            setProgress(parsedProgress);
          }
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Invalid time format";
        window.alert(errorMessage);
      }
    }
  };

  const renderTimerStatus = () => {
    return (
      <div className="relative flex flex-col justify-center items-center align-center w-full h-full">
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          className="relative flex flex-col justify-center items-center align-center w-[35vw] h-full appearance-none border-none outline-none"
          title={`${
            isRunning ? (isPaused ? "Resume" : "Pause") : "Start"
          } Double click to set the progress`}
          disabled={isJoining || (isConnected && !isHost)}
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
              <div className="text-3xl font-bold hover:text-gray-500 text-foreground">
                {isJoining
                  ? "Joining..."
                  : isConnected && !isRunning
                  ? "Waiting..."
                  : "Start"}
              </div>
            )}
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className={`relative w-full h-[70%] ${className || ""}`}>
      <TimerWithProgress
        progress={isResting ? workTime : progress}
        max={workTime}
        id="working"
        isLoading={!isRunning && !isHost && isJoining}
        isWaiting={isConnected && !isRunning}
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
            max={restTime}
            id="resting"
          >
            {renderTimerStatus()}
          </TimerWithProgress>
        </div>
      </TimerWithProgress>
    </div>
  );
}
