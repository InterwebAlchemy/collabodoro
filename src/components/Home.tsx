"use client";

import Timer from "./Timer";
import StartButton from "./StartButton";
import PauseButton from "./PauseButton";
import ResetButton from "./ResetButton";
import PeerConnection from "./PeerConnection";
import TimerConfigStatus from "./TimerConfigStatus";
// import ConnectionDiagnostic from "./ConnectionDiagnostic";
import { usePeer } from "../contexts/PeerContext";
import { useTimer } from "../contexts/TimerContext";
import { useEffect, useState } from "react";

export interface HomeProps {
  join?: string | null;
  error?: string | null;
}

const ERROR_MESSAGES: Record<string, string> = {
  "connection-timeout": "Could not connect to session. Please try again.",
};

// Main component using context providers
export default function Home({ join, error }: HomeProps) {
  const { isRunning } = useTimer();
  const { isHost, peerId, isPeerConnected, isJoining, isInitializing } =
    usePeer();
  const [showError, setShowError] = useState(error !== null);

  useEffect(() => {
    if ((error && peerId) || isRunning || isInitializing) {
      setShowError(false);
    }
  }, [error, isRunning, isJoining, isInitializing, peerId]);

  return (
    <div className="flex flex-col w-full h-full align-center justify-center items-center ">
      <main className="relative flex flex-col gap-8 w-full h-full row-start-2 align-center items-center justify-center">
        <Timer />
        <TimerConfigStatus />

        {showError && error && (
          <div className="text-red-500">{ERROR_MESSAGES[error]}</div>
        )}

        {!peerId || isHost || !isPeerConnected ? (
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
            <PeerConnection join={join} />
          </div>
        </div>
      </main>
    </div>
  );
}
