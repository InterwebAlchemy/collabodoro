"use client";

import { IconRotateClockwise2, IconRotate2 } from "@tabler/icons-react";
import IconButton from "./IconButton";
import { useConfig } from "../contexts/ConfigContext";

/**
 * DirectionToggle component
 * Provides a button to toggle between count up and count down timer directions
 * @returns A direction toggle button component
 */
export default function DirectionToggle() {
  const { direction, setDirection } = useConfig();

  // Calculate the next direction in the cycle (countUp -> countDown -> countUp)
  const nextDirection = direction === "countUp" ? "countDown" : "countUp";

  /**
   * Toggle between count up and count down directions
   */
  const toggleDirection = () => {
    setDirection(nextDirection);
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <div className="text-sm text-gray-500 italic">
        {direction === "countUp" ? "Count Up" : "Count Down"}
      </div>
      <IconButton
        onClick={toggleDirection}
        icon={
          direction === "countUp" ? <IconRotateClockwise2 /> : <IconRotate2 />
        }
        label={`Switch to ${
          nextDirection === "countUp" ? "Count Up" : "Count Down"
        }`}
      />
    </div>
  );
}
