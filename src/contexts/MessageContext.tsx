import { createContext, useContext } from "react";

export type TimerMessageType =
  | "START"
  | "PAUSE"
  | "RESET"
  | "SYNC"
  | "STOP"
  | "COMPLETE";

// Define timer message type
export interface TimerMessage {
  type: TimerMessageType;
  payload: {
    isRunning?: boolean;
    isPaused?: boolean;
    progress?: number;
    isWorking?: boolean;
    isResting?: boolean;
    workTime?: number;
    restTime?: number;
    timestamp?: number;
  };
}

// Create a custom hook for message context sharing
export const MessageContext = createContext<{
  message: TimerMessage | null;
  setMessage: React.Dispatch<React.SetStateAction<TimerMessage | null>>;
} | null>(null);

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};
