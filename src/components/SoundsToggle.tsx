"use client";

import { useEffect, useState } from "react";
import { IconVolume, IconVolumeOff } from "@tabler/icons-react";
import IconButton from "./IconButton";
import {
  getSoundsPreference,
  setSoundsPreference,
  SoundsState,
} from "../utils/sounds";

/**
 * SoundsToggle component
 * Provides a button to toggle timer sounds on/off
 * @returns A sounds toggle button component
 */
export default function SoundsToggle() {
  const [soundsState, setSoundsState] = useState<SoundsState>("disabled");

  // Calculate the next sounds state in the cycle (enabled -> disabled -> enabled)
  const nextSoundsState = soundsState === "enabled" ? "disabled" : "enabled";

  // Initialize sounds state from localStorage
  useEffect(() => {
    setSoundsState(getSoundsPreference());
  }, []);

  /**
   * Toggle between enabled and disabled sounds
   */
  const toggleSounds = () => {
    setSoundsState(nextSoundsState);
    setSoundsPreference(nextSoundsState);
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="text-sm text-gray-500 italic">
        {soundsState === "enabled" ? "Enabled" : "Disabled"}
      </div>
      <IconButton
        onClick={toggleSounds}
        icon={soundsState === "enabled" ? <IconVolume /> : <IconVolumeOff />}
        label={`${nextSoundsState === "enabled" ? "Enable" : "Disable"} Sounds`}
      />
    </div>
  );
}
