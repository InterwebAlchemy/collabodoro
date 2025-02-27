"use client";

import React, { useState } from "react";
import { MessageContext, type TimerMessage } from "../contexts/MessageContext";
import { PeerProvider } from "../contexts/PeerContext";
import Home from "../components/Home";

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
    <PeerProvider
      onMessageReceived={handlePeerMessage}
      onConnectionEstablished={handleConnectionEstablished}
    >
      <MessageContext.Provider
        value={{ message: currentMessage, setMessage: setCurrentMessage }}
      >
        <Home />
      </MessageContext.Provider>
    </PeerProvider>
  );
}
