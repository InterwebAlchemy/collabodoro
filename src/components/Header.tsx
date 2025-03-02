import { IconClockCode } from "@tabler/icons-react";
import Ciph3rText from "@interwebalchemy/ciph3r-text";

import ThemeToggle from "./ThemeToggle";
import CollaborationStatus from "./CollaborationStatus";
import { useTimer } from "../contexts/TimerContext";
import { usePeer } from "../contexts/PeerContext";
import { useEffect, useState } from "react";

const defaultTitle = "Collabo";
const disconnectedTitle = "Solo";

/**
 * Header component
 * Displays at the top of the app with the app title and theme toggle button
 */
export default function Header() {
  const [oldTitle, setOldTitle] = useState(defaultTitle);
  const [title, setTitle] = useState(defaultTitle);
  const { isRunning } = useTimer();
  const { isPeerConnected, isHost, peerId } = usePeer();

  useEffect(() => {
    console.log("Running?:", isRunning);
    console.log("Connected?:", isHost || isPeerConnected);
    console.log("isHost:", isHost);
    console.log("isPeerConnected:", isPeerConnected);
    console.log("peerId:", peerId);

    if (isRunning) {
      if ((!isHost && !isPeerConnected) || !peerId) {
        setTitle(disconnectedTitle);
      } else {
        setTitle(defaultTitle);
      }
    } else {
      setTitle(defaultTitle);
    }
  }, [isRunning, isHost, isPeerConnected, peerId]);

  useEffect(() => {
    console.log("oldTitle:", oldTitle);
    console.log("title:", title);
  }, [oldTitle, title]);

  return (
    <header className="w-full p-4 flex justify-start items-center">
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
                console.log("FINISHED:", oldTitle, title);
                setOldTitle(title);
              }}
            />
            doro
          </span>
        </a>
      </h1>
      <CollaborationStatus />
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
