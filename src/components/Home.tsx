"use client";

import React from "react";
import Timer from "./Timer";
import StartButton from "./StartButton";
import PauseButton from "./PauseButton";
import ResetButton from "./ResetButton";
// import PeerConnection from "./PeerConnection";
// import CollaborationStatus from "./CollaborationStatus";
// import ConnectionDiagnostic from "./ConnectionDiagnostic";
import { usePeer } from "../contexts/PeerContext";
import { useTimer } from "../contexts/TimerContext";

// Main component using context providers
export default function Home() {
  const { isRunning } = useTimer();
  const { isHost, peerId } = usePeer();

  return (
    <div className="flex flex-col w-full h-full align-center justify-center items-center ">
      <main className="relative flex flex-col gap-8 w-full h-full row-start-2 align-center items-center justify-center">
        <Timer />

        {!peerId || isHost ? (
          <div className="flex w-full justify-center items-center align-center gap-7">
            <StartButton />
            {isRunning && <PauseButton />}
            {isRunning && <ResetButton />}
          </div>
        ) : (
          <></>
        )}

        {/* <CollaborationStatus className="mb-2" />
        <PeerConnection />

        {isPeerConnected && lastSyncTime && (
          <div className="mt-2 text-xs text-gray-500">
            Last sync: {lastSyncType} at {lastSyncTime}
          </div>
        )}

        <ConnectionDiagnostic /> */}
      </main>
    </div>
  );
}
