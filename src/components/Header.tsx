import { IconClockCode } from "@tabler/icons-react";
import ThemeToggle from "./ThemeToggle";
import CollaborationStatus from "./CollaborationStatus";

/**
 * Header component
 * Displays at the top of the app with the app title and theme toggle button
 */
export default function Header() {
  return (
    <header className="w-full p-4 flex justify-start items-center">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <IconClockCode color="var(--working-color)" />
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">Collabodoro</a>
      </h1>
      <CollaborationStatus />
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
