"use client";

import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

import TimerWithProgress from "./TimerProgress";
import { WORK_TIME, REST_TIME, TIME_SYNC_INTERVAL } from "../constants/time";
import { WORKING_COLOR, RESTING_COLOR } from "../constants/color";

export interface TimerProps {
  shouldRun?: boolean;
  isPaused?: boolean;
  progress?: number;
  setProgress?: React.Dispatch<React.SetStateAction<number>>;
  onTimerComplete?: () => void;
  isWorking?: boolean;
  isResting?: boolean;
}

export default function Timer({
  shouldRun = true,
  isPaused = false,
  progress = 0,
  setProgress = () => {},
  onTimerComplete = () => {},
  isWorking = false,
  isResting = false,
}: TimerProps) {
  const [currentTimestamp, setCurrentTimestamp] = useState(0);

  const humanizeTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${hours > 0 ? `${hours.toString().padStart(2, "0")}h ` : ""}${
      minutes > 0 ? `${minutes.toString().padStart(2, "0")}m ` : ""
    }${remainingSeconds.toString().padStart(2, "0")}s`;
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
    isPaused ? null : 1000
  );

  useInterval(
    async () => {
      console.log(currentTimestamp, "need to sync time");
    },
    isPaused ? null : TIME_SYNC_INTERVAL
  );

  // useEffect(() => {
  //   const timeSyncInterval = setInterval(async () => {
  //     const response = await fetch("/api/sync", {
  //       method: "GET",
  //       headers: {
  //         "x-client-time": currentTimestamp.toString(),
  //       },
  //     })
  //       .then(async (res) => {
  //         if (res.ok) {
  //           return await res.json();
  //         }
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       });

  //     console.log(response);
  //   }, TIME_SYNC_INTERVAL);

  //   return () => {
  //     clearInterval(timeSyncInterval);
  //   };
  // }, [currentTimestamp]);

  const renderTimerStatus = () => {
    return (
      <div className="flex flex-col justify-center items-center align-center w-full h-full">
        <div className="text-4xl font-bold">{humanizeTime(progress)}</div>
        <div className="text-sm text-gray-500">
          {isWorking ? "Working" : "Resting"}
        </div>
      </div>
    );
  };

  if (isWorking) {
    return (
      <TimerWithProgress
        progress={progress}
        max={WORK_TIME}
        color={WORKING_COLOR}
      >
        {renderTimerStatus()}
      </TimerWithProgress>
    );
  }

  if (isResting) {
    return (
      <TimerWithProgress
        progress={WORK_TIME}
        max={WORK_TIME}
        color={WORKING_COLOR}
      >
        <div className="w-[90%] h-[90%]">
          <TimerWithProgress
            progress={progress}
            max={REST_TIME}
            color={RESTING_COLOR}
          >
            {renderTimerStatus()}
          </TimerWithProgress>
        </div>
      </TimerWithProgress>
    );
  }

  return <></>;
}
