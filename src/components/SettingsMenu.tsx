import { useState, useRef } from "react";
import { IconDeviceWatchCog, IconX } from "@tabler/icons-react";
import { useOnClickOutside } from "usehooks-ts";

import IconButton from "./IconButton";
import ThemeToggle from "./ThemeToggle";
import TimerConfig from "./TimerConfig";
import DirectionToggle from "./DirectionToggle";
import AlertsToggle from "./AlertsToggle";
import SoundsToggle from "./SoundsToggle";

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside([containerRef as React.RefObject<HTMLDivElement>], () =>
    setIsOpen(false)
  );

  return (
    <div ref={containerRef}>
      <div className="flex flex-row gap-2 items-center">
        <IconButton
          icon={isOpen ? <IconX /> : <IconDeviceWatchCog />}
          onClick={() => setIsOpen((open) => !open)}
          label={isOpen ? "Close" : "Config"}
          showLabel={!isOpen}
        />
      </div>
      {isOpen && (
        <div className="absolute w-full max-w-[90vw] md:max-w-[450px] top-[100%] right-[18px] shadow-lg rounded-lg p-4 z-10 ring-2 ring-[var(--btn-border-color)] bg-background transition-discrete transition-colors duration-1000 ease">
          <div className="flex flex-col gap-3">
            <TimerConfig />
            <div className="flex flex-row gap-2 items-center">
              <div className="text-md font-bold">Timer Display</div>
              <div className="ml-auto">
                <DirectionToggle />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row gap-2 items-center">
                <div className="flex flex-col gap-1">
                  <div className="text-md font-bold">Alerts</div>
                  <div className="text-xs text-gray-500 text-right ml-auto">
                    Browser notifications.
                  </div>
                </div>
                <div className="ml-auto">
                  <AlertsToggle />
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="flex flex-col gap-1">
                <div className="text-md font-bold">Sounds</div>
                <div className="text-xs text-gray-500 text-right ml-auto">
                  Sound effects.
                </div>
              </div>
              <div className="ml-auto">
                <SoundsToggle />
              </div>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <div className="text-md font-bold">Theme</div>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
