import { useEffect, useState } from "react";
import { IconClockCode } from "@tabler/icons-react";
import Ciph3rText from "@interwebalchemy/ciph3r-text";

import CollaborationStatus from "./CollaborationStatus";
import SettingsMenu from "./SettingsMenu";

import { useTimer } from "../contexts/TimerContext";
import { usePeer } from "../contexts/PeerContext";

const defaultTitle = "Collabo";
const disconnectedTitle = "Solo";

/**
 * Header component
 * Displays at the top of the app with the app title and theme toggle button
 */
export default function Header() {
  const [oldTitle, setOldTitle] = useState(defaultTitle);
  const [title, setTitle] = useState(defaultTitle);
  const { isRunning, wasReset } = useTimer();
  const { isPeerConnected, isHost, peerId } = usePeer();

  useEffect(() => {
    if (!wasReset) {
      if (isRunning) {
        if ((!isHost && !isPeerConnected) || !peerId) {
          setTitle(disconnectedTitle);
        } else {
          setTitle(defaultTitle);
        }
      } else {
        setTitle(defaultTitle);
      }
    }
  }, [isRunning, wasReset, isHost, isPeerConnected, peerId]);

  return (
    <header className="relative w-full p-4 flex justify-start items-center z-10">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <IconClockCode color="var(--working-color)" />
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <span>
            <Ciph3rText
              defaultText={oldTitle}
              targetText={title}
              iterationSpeed={50}
              maxIterations={6}
              action="transform"
              onFinish={() => {
                setOldTitle(title);
              }}
            />
            doro
          </span>
        </a>
        <span className="text-xs font-weight-300 text-gray-500">beta</span>
      </h1>
      <CollaborationStatus />
      <div className="ml-auto">
        <SettingsMenu />
      </div>
    </header>
  );
}
