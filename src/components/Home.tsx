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

export interface HomeProps {
  join?: string;
}

// Main component using context providers
export default function Home({ join }: HomeProps) {
  const { isRunning } = useTimer();
  const { isHost, peerId, isPeerConnected, isJoining } = usePeer();

  return (
    <div className="flex flex-col w-full h-full align-center justify-center items-center ">
      <main className="relative flex flex-col gap-8 w-full h-full row-start-2 align-center items-center justify-center">
        <Timer />
        <TimerConfigStatus />

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
