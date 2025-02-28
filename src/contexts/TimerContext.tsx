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
import { useAudio } from "./AudioContext";
import { useConfig } from "./ConfigContext";

interface TimerContextType {
  // Timer config
  workTime: number;
  restTime: number;

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
  const { playSound } = useAudio();
  const { workTime: configWorkTime, restTime: configRestTime } = useConfig();
  const { sendMessage, isPeerConnected, isHost } = usePeer();
  const { message } = useMessageContext();

  // Use internal state for the current session's timer settings
  const [workTime, setWorkTimeState] = useState(configWorkTime);
  const [restTime, setRestTimeState] = useState(configRestTime);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [wasReset, setWasReset] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isWorking, setIsWorking] = useState(true);
  const [isResting, setIsResting] = useState(false);

  // Update internal values when config changes
  useEffect(() => {
    if (!isPeerConnected || isHost) {
      setWorkTimeState(configWorkTime);
      setRestTimeState(configRestTime);
    }
  }, [configWorkTime, configRestTime, isPeerConnected, isHost]);

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
          workTime,
          restTime,
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
    workTime,
    restTime,
    sendMessage,
  ]);

  // Process messages received from peers
  useEffect(() => {
    if (!message) return;

    console.debug("receiving message", message);

    // Special case: client is requesting initial state
    if (message.type === "SYNC" && isHost) {
      sendCurrentTimerState();
      return;
    }

    // Regular message processing (only for non-hosts)
    if (!isHost) {
      const { type, payload } = message;

      console.debug(type, payload);

      switch (type) {
        case "START":
          setIsRunning(payload.isRunning ?? false);
          setIsPaused(payload.isPaused ?? false);
          setProgress(payload.progress ?? 0);
          setIsWorking(payload.isWorking ?? true);
          setIsResting(payload.isResting ?? false);
          handleStart();

          break;

        case "STOP":
          setIsRunning(payload.isRunning ?? false);
          setIsPaused(payload.isPaused ?? false);
          setProgress(payload.progress ?? 0);
          setIsWorking(payload.isWorking ?? true);
          setIsResting(payload.isResting ?? false);

          break;

        case "PAUSE":
          handlePause();

          break;

        case "SYNC":
          setProgress(payload.progress ?? 0);
          setIsWorking(payload.isWorking ?? true);
          setIsResting(payload.isResting ?? false);
          setIsRunning(payload.isRunning ?? false);
          setIsPaused(payload.isPaused ?? false);

          // Temporarily apply host's timer configuration without saving to localStorage
          if (payload.workTime) {
            setWorkTimeState(payload.workTime);
          }

          if (payload.restTime) {
            setRestTimeState(payload.restTime);
          }

          break;

        case "RESET":
          setIsRunning(false);
          setIsPaused(false);
          setProgress(0);
          setIsWorking(payload.isWorking ?? true);
          setIsResting(payload.isResting ?? false);
          setWasReset(true);

          break;

        default:
          console.warn("Unknown message type:", type);
      }
    }
  }, [message, isHost]);

  // Handle the timer completion
  const onTimerComplete = useCallback(() => {
    playSound("NOTIFICATION");

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
          workTime,
          restTime,
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
    workTime,
    restTime,
    sendMessage,
    playSound,
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
          workTime,
          restTime,
          timestamp: Date.now(),
        },
      });
    }
  }, [
    isRunning,
    isHost,
    progress,
    isWorking,
    isResting,
    workTime,
    restTime,
    sendMessage,
  ]);

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
          workTime,
          restTime,
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
    workTime,
    restTime,
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
          workTime,
          restTime,
          timestamp: Date.now(),
        },
      });
    }
  }, [isWorking, isResting, isHost, workTime, restTime, sendMessage]);

  useTimeout(
    () => {
      setIsRunning(true);
      setWasReset(false);
    },
    wasReset ? 100 : null
  );

  const value = {
    // Config
    workTime,
    restTime,

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
