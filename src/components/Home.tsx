"use client";

import { Suspense } from "react";

import Timer from "./Timer";
import StartButton from "./StartButton";
import PauseButton from "./PauseButton";
import ResetButton from "./ResetButton";
import PeerConnection from "./PeerConnection";
import TimerConfigStatus from "./TimerConfigStatus";
// import ConnectionDiagnostic from "./ConnectionDiagnostic";
import { usePeer } from "../contexts/PeerContext";
import { useTimer } from "../contexts/TimerContext";

// Main component using context providers
export default function Home() {
  const { isRunning } = useTimer();
  const { isHost, isJoining, isConnected } = usePeer();

  return (
    <div className="flex flex-col w-full h-full align-center justify-center items-center ">
      <main className="relative flex flex-col gap-8 w-full h-full row-start-2 align-center items-center justify-center">
        <Timer />
        <TimerConfigStatus />

        {!isConnected || isHost ? (
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="flex w-full justify-center items-center align-center gap-7">
              {!isJoining && <StartButton />}
              {isRunning && <PauseButton />}
              {isRunning && <ResetButton />}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="w-full flex flex-col gap-2 px-4">
          <div className="flex flex-col gap-2 justify-end">
            <Suspense fallback={<></>}>
              <PeerConnection />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
