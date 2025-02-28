"use client";

import React, { useState } from "react";
import Timer from "./Timer";
import StartButton from "./StartButton";
import PauseButton from "./PauseButton";
import ResetButton from "./ResetButton";
import PeerConnection from "./PeerConnection";
import CollaborationStatus from "./CollaborationStatus";
import TimerConfig from "./TimerConfig";
import TimerConfigStatus from "./TimerConfigStatus";
// import ConnectionDiagnostic from "./ConnectionDiagnostic";
import { usePeer } from "../contexts/PeerContext";
import { useTimer } from "../contexts/TimerContext";

// Main component using context providers
export default function Home() {
  const { isRunning, isPaused } = useTimer();
  const { isHost, peerId } = usePeer();
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className="flex flex-col w-full h-full align-center justify-center items-center ">
      <main className="relative flex flex-col gap-8 w-full h-full row-start-2 align-center items-center justify-center">
        <Timer />
        <TimerConfigStatus />

        {!peerId || isHost ? (
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="flex w-full justify-center items-center align-center gap-7">
              <StartButton />
              {isRunning && <PauseButton />}
              {isRunning && <ResetButton />}
            </div>

            {!isRunning ||
              (isPaused && (
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="text-sm underline hover:text-primary"
                >
                  {showConfig ? "Hide Settings" : "Configure Timer"}
                </button>
              ))}

            {showConfig && (
              <div className="w-full max-w-md px-4">
                <TimerConfig />
              </div>
            )}
          </div>
        ) : (
          <></>
        )}

        <div className="w-full flex flex-col gap-2 px-4">
          <div className="flex flex-col gap-2 justify-end">
            <CollaborationStatus />
            <PeerConnection />
          </div>

          {/* <ConnectionDiagnostic /> */}
        </div>
      </main>
    </div>
  );
}
