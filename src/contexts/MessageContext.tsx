import { createContext, useContext } from "react";

// Define timer message type
export interface TimerMessage {
  type: "START" | "PAUSE" | "RESET" | "SYNC" | "STOP";
  payload: {
    isRunning?: boolean;
    isPaused?: boolean;
    progress?: number;
    isWorking?: boolean;
    isResting?: boolean;
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
