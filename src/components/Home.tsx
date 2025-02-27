"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTimeout } from "usehooks-ts";
import Timer from "./Timer";
import StartButton from "./StartButton";
import PauseButton from "./PauseButton";
import ResetButton from "./ResetButton";
// import PeerConnection from "./PeerConnection";
// import CollaborationStatus from "./CollaborationStatus";
// import ConnectionDiagnostic from "./ConnectionDiagnostic";
import { usePeer } from "../contexts/PeerContext";
import { useMessageContext } from "../contexts/MessageContext";

// Wrap our main component with the PeerProvider
export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [wasReset, setWasReset] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [isResting, setIsResting] = useState(false);
  // const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  // const [lastSyncType, setLastSyncType] = useState<string | null>(null);
  const { sendMessage, isPeerConnected, isHost, peerId } = usePeer();
  const { message } = useMessageContext();

  // Send current timer state to newly connected peer
  const sendCurrentTimerState = useCallback(() => {
    if (isPeerConnected && isHost) {
      sendMessage({
        type: "SYNC",
        payload: {
          isRunning,
          isPaused,
          progress,
          isWorking,
          isResting,
          timestamp: Date.now(),
        },
      });

      // Update sync status
      // setLastSyncTime(new Date().toLocaleTimeString());
      // setLastSyncType("Initial Sync (sent)");
    }
  }, [
    isPeerConnected,
    isHost,
    isRunning,
    isPaused,
    progress,
    isWorking,
    isResting,
    sendMessage,
  ]);

  // Process messages received from peers
  useEffect(() => {
    console.debug("receiving message", message);

    if (!message) return;

    // Special case: client is requesting initial state
    if (message.type === "SYNC" && isHost) {
      sendCurrentTimerState();
      return;
    }

    // Regular message processing (only for non-hosts)
    if (!isHost) {
      const { type, payload } = message;

      console.debug(type, payload);

      if (type === "START") {
        setIsRunning(payload.isRunning ?? false);
        setIsPaused(payload.isPaused ?? false);
        setProgress(payload.progress ?? 0);
        setIsWorking(payload.isWorking ?? true);
        setIsResting(payload.isResting ?? false);

        // Update sync status
        // setLastSyncTime(new Date().toLocaleTimeString());
        // setLastSyncType("START (received)");

        handleStart();
      } else if (type === "STOP") {
        setIsRunning(payload.isRunning ?? false);
        setIsPaused(payload.isPaused ?? false);
        setProgress(payload.progress ?? 0);
        setIsWorking(payload.isWorking ?? true);
        setIsResting(payload.isResting ?? false);

        // Update sync status
        // setLastSyncTime(new Date().toLocaleTimeString());
        // setLastSyncType("STOP (received)");
      } else if (type === "PAUSE") {
        handlePause();

        // Update sync status
        // setLastSyncTime(new Date().toLocaleTimeString());
        // setLastSyncType("PAUSE (received)");
      } else if (type === "SYNC") {
        setProgress(payload.progress ?? 0);
        setIsWorking(payload.isWorking ?? true);
        setIsResting(payload.isResting ?? false);
        setIsRunning(payload.isRunning ?? false);
        setIsPaused(payload.isPaused ?? false);

        // Update sync status
        // setLastSyncTime(new Date().toLocaleTimeString());
        // setLastSyncType("SYNC (received)");
      }
    }
  }, [message, isHost]);

  // Handle the timer completion
  const onTimerComplete = () => {
    if (isWorking) {
      setIsWorking(false);
      setIsResting(true);
    } else {
      setIsWorking(true);
      setIsResting(false);
    }

    // Synchronize with connected peers
    if (isPeerConnected) {
      sendMessage({
        type: "SYNC",
        payload: {
          isRunning,
          isPaused,
          progress: 0, // Reset progress
          isWorking: !isWorking,
          isResting: !isResting,
          timestamp: Date.now(),
        },
      });

      // Update sync status if host
      if (isHost) {
        // setLastSyncTime(new Date().toLocaleTimeString());
        // setLastSyncType("Timer Complete (sent)");
      }
    }
  };

  // Handle starting the timer
  const handleStart = () => {
    const newIsRunning = !isRunning;

    setIsRunning(newIsRunning);

    // If stopping, also reset progress
    if (!newIsRunning) {
      setProgress(0);
      setIsPaused(false);
      setIsWorking(true);
      setIsResting(false);
    } else {
      setIsWorking(true);
      setIsResting(false);
    }

    // Synchronize with connected peers
    if (isHost) {
      const messageType = isRunning ? "STOP" : "START";

      sendMessage({
        type: messageType,
        payload: {
          isRunning: newIsRunning,
          isPaused: false,
          progress: newIsRunning ? progress : 0,
          isWorking: newIsRunning ? isWorking : true,
          isResting: newIsRunning ? isResting : false,
          timestamp: Date.now(),
        },
      });

      // Update sync status if host
      if (isHost) {
        // setLastSyncTime(new Date().toLocaleTimeString());
        // setLastSyncType("START (sent)");
      }
    }
  };

  const handleReset = () => {
    setWasReset(true);

    const newIsRunning = false;
    const newIsPaused = false;
    const newProgress = 0;
    const newIsWorking = isWorking;
    const newIsResting = isResting;

    setIsRunning(newIsRunning);
    setIsPaused(newIsPaused);
    setProgress(newProgress);
    setIsWorking(newIsWorking);
    setIsResting(newIsResting);

    // Synchronize with connected peers
    if (isHost) {
      sendMessage({
        type: "RESET",
        payload: {
          isRunning: newIsRunning,
          isPaused: newIsPaused,
          progress: newProgress,
          isWorking: newIsWorking,
          isResting: newIsResting,
          timestamp: Date.now(),
        },
      });
    }
  };

  // Handle pausing the timer
  const handlePause = () => {
    const newIsPaused = !isPaused;

    if (!isRunning) {
      setIsPaused(false);
      setIsRunning(true);
      setProgress(0);
      setIsWorking(true);
      setIsResting(false);
    } else {
      setIsPaused(newIsPaused);
    }

    // Synchronize with connected peers
    if (isHost) {
      sendMessage({
        type: "PAUSE",
        payload: {
          isRunning,
          isPaused: newIsPaused,
          progress,
          isWorking,
          isResting,
          timestamp: Date.now(),
        },
      });

      // Update sync status if host
      if (isHost) {
        // setLastSyncTime(new Date().toLocaleTimeString());
        // setLastSyncType("PAUSE (sent)");
      }
    }
  };

  useEffect(() => {
    console.log("peerId", peerId);
  }, [peerId]);

  useTimeout(
    () => {
      setIsRunning(true);
      setWasReset(false);
    },
    wasReset ? 100 : null
  );

  return (
    <div className="flex flex-col w-full h-full align-center justify-center items-center ">
      <main className="relative flex flex-col gap-8 w-full h-full row-start-2 align-center items-center justify-center">
        <Timer
          progress={progress}
          setProgress={setProgress}
          shouldRun={isRunning}
          isPaused={isPaused}
          onTimerComplete={onTimerComplete}
          isWorking={isWorking}
          isResting={isResting}
          isSynced={!isHost}
          onPause={handlePause}
          wasReset={wasReset}
        />

        {!peerId || isHost ? (
          <div className="flex w-full justify-center items-center align-center gap-7">
            <StartButton start={handleStart} isRunning={isRunning} />
            {isRunning && (
              <PauseButton pause={handlePause} isPaused={isPaused} />
            )}
            {isRunning && <ResetButton reset={handleReset} />}
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
