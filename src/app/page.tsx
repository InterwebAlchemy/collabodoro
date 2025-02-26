"use client";

import { useState } from "react";
import Timer from "../components/Timer";
import StartButton from "../components/StartButton";
import PauseButton from "../components/PauseButton";

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isResting, setIsResting] = useState(false);

  const onTimerComplete = () => {
    if (isWorking) {
      setIsWorking(false);
      setIsResting(true);
    } else {
      setIsWorking(true);
      setIsResting(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center align-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-0 w-full h-full row-start-2 align-center items-center justify-center sm:items-start">
        {isRunning && (
          <>
            <Timer
              progress={progress}
              setProgress={setProgress}
              shouldRun={isRunning}
              isPaused={isPaused}
              onTimerComplete={onTimerComplete}
              isWorking={isWorking}
              isResting={isResting}
            />
          </>
        )}
        <div className="flex w-full justify-center items-center align-center gap-7">
          <StartButton
            start={() => setIsRunning((prev) => !prev)}
            isRunning={isRunning}
          />
          {isRunning && (
            <PauseButton
              pause={() => setIsPaused((prev) => !prev)}
              isPaused={isPaused}
            />
          )}
        </div>
      </main>
    </div>
  );
}
