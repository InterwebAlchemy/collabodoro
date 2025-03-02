"use client";

import { useState } from "react";

import { MessageContext, type TimerMessage } from "../contexts/MessageContext";
import { PeerProvider } from "../contexts/PeerContext";
import { TimerProvider } from "../contexts/TimerContext";
import { AudioProvider } from "../contexts/AudioContext";
import { ConfigProvider } from "../contexts/ConfigContext";
import Home from "../components/Home";
import Screen from "../components/Screen";

export default function HomePage() {
  const [currentMessage, setCurrentMessage] = useState<TimerMessage | null>(
    null
  );

  // Process messages from peers
  const handlePeerMessage = (message: TimerMessage) => {
    setCurrentMessage(message);
  };

  // Handle when a connection is established
  const handleConnectionEstablished = (isHost: boolean) => {
    console.log(`Connection established as ${isHost ? "host" : "client"}`);
    // Connection is established - the message system will handle the initial sync
  };

  return (
    <ConfigProvider>
      <AudioProvider>
        <PeerProvider
          onMessageReceived={handlePeerMessage}
          onConnectionEstablished={handleConnectionEstablished}
        >
          <MessageContext.Provider
            value={{ message: currentMessage, setMessage: setCurrentMessage }}
          >
            <TimerProvider>
              <Screen>
                <Home />
              </Screen>
            </TimerProvider>
          </MessageContext.Provider>
        </PeerProvider>
      </AudioProvider>
    </ConfigProvider>
  );
}
