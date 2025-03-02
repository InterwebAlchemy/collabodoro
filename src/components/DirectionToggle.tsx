"use client";

import { useEffect, useState } from "react";
import { IconRotateClockwise2, IconRotate2 } from "@tabler/icons-react";
import IconButton from "./IconButton";
import {
  getDirectionPreference,
  setDirectionPreference,
  Direction,
} from "../utils/direction";

/**
 * DirectionToggle component
 * Provides a button to toggle between count up and count down timer directions
 * @returns A direction toggle button component
 */
export default function DirectionToggle() {
  const [direction, setDirection] = useState<Direction>("countDown");

  // Calculate the next direction in the cycle (countUp -> countDown -> countUp)
  const nextDirection = direction === "countUp" ? "countDown" : "countUp";

  // Initialize direction state from localStorage
  useEffect(() => {
    setDirection(getDirectionPreference());
  }, []);

  /**
   * Toggle between count up and count down directions
   */
  const toggleDirection = () => {
    setDirection(nextDirection);
    setDirectionPreference(nextDirection);
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="text-sm text-gray-500 italic">
        {direction === "countUp" ? "Count Up" : "Count Down"}
      </div>
      <IconButton
        onClick={toggleDirection}
        icon={
          direction === "countUp" ? <IconRotate2 /> : <IconRotateClockwise2 />
        }
        label={`Switch to ${
          nextDirection === "countUp" ? "Count Up" : "Count Down"
        }`}
      />
    </div>
  );
}
