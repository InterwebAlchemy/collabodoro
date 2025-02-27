import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useTimeout } from "usehooks-ts";
import { usePeer } from "./PeerContext";
import { useMessageContext } from "./MessageContext";

interface TimerContextType {
  // Timer state
  isRunning: boolean;
  isPaused: boolean;
  wasReset: boolean;
  progress: number;
  isWorking: boolean;
  isResting: boolean;

  // Timer actions
  handleStart: () => void;
  handlePause: () => void;
  handleReset: () => void;
  setProgress: Dispatch<SetStateAction<number>>;
  onTimerComplete: () => void;
}

const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [wasReset, setWasReset] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isResting, setIsResting] = useState(false);

  const { sendMessage, isPeerConnected, isHost } = usePeer();
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
        handleStart();
      } else if (type === "STOP") {
        setIsRunning(payload.isRunning ?? false);
        setIsPaused(payload.isPaused ?? false);
        setProgress(payload.progress ?? 0);
        setIsWorking(payload.isWorking ?? true);
        setIsResting(payload.isResting ?? false);
      } else if (type === "PAUSE") {
        handlePause();
      } else if (type === "SYNC") {
        setProgress(payload.progress ?? 0);
        setIsWorking(payload.isWorking ?? true);
        setIsResting(payload.isResting ?? false);
        setIsRunning(payload.isRunning ?? false);
        setIsPaused(payload.isPaused ?? false);
      } else if (type === "RESET") {
        setIsRunning(false);
        setIsPaused(false);
        setProgress(0);
        setIsWorking(payload.isWorking ?? true);
        setIsResting(payload.isResting ?? false);
        setWasReset(true);
      }
    }
  }, [message, isHost]);

  // Handle the timer completion
  const onTimerComplete = useCallback(() => {
    if (isWorking) {
      setIsWorking(false);
      setIsResting(true);
    } else {
      setIsWorking(true);
      setIsResting(false);
    }

    // Synchronize with connected peers
    if (isPeerConnected && isHost) {
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
    }
  }, [
    isWorking,
    isResting,
    isPeerConnected,
    isHost,
    isRunning,
    isPaused,
    sendMessage,
  ]);

  // Handle starting the timer
  const handleStart = useCallback(() => {
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
    }
  }, [isRunning, isHost, progress, isWorking, isResting, sendMessage]);

  // Handle pausing the timer
  const handlePause = useCallback(() => {
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
    }
  }, [
    isPaused,
    isRunning,
    progress,
    isWorking,
    isResting,
    isHost,
    sendMessage,
  ]);

  // Handle resetting the timer
  const handleReset = useCallback(() => {
    setWasReset(true);

    const newIsRunning = false;
    const newIsPaused = false;
    const newProgress = 0;
    const newIsWorking = isWorking;
    const newIsResting = isResting;

    setIsRunning(newIsRunning);
    setIsPaused(newIsPaused);
    setProgress(newProgress);

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
  }, [isWorking, isResting, isHost, sendMessage]);

  useTimeout(
    () => {
      setIsRunning(true);
      setWasReset(false);
    },
    wasReset ? 100 : null
  );

  const value = {
    // State
    isRunning,
    isPaused,
    wasReset,
    progress,
    isWorking,
    isResting,

    // Actions
    handleStart,
    handlePause,
    handleReset,
    setProgress,
    onTimerComplete,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};

/**
 * Custom hook to access the Timer context
 * @returns {TimerContextType} The timer context containing state and actions
 */
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);

  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }

  return context;
};
