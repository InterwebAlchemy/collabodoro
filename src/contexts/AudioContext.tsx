import React, { createContext, useContext, useRef, useState } from "react";
import { SOUND_MAP } from "../constants/audio";

interface AudioContextProps {
  playSound: (soundId: keyof typeof SOUND_MAP) => void;
  stopSound: (soundId: keyof typeof SOUND_MAP) => void;
  isPlaying: Record<keyof typeof SOUND_MAP, boolean>;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

/**
 * Provider component for audio playback functionality across the application
 *
 * @param children - React children components
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  // Track all audio elements and playing state
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const [isPlaying, setIsPlaying] = useState<
    Record<keyof typeof SOUND_MAP, boolean>
  >(() => {
    const initialState: Record<string, boolean> = {};

    Object.keys(SOUND_MAP).forEach((key) => {
      initialState[key as keyof typeof SOUND_MAP] = false;
    });

    return initialState as Record<keyof typeof SOUND_MAP, boolean>;
  });

  /**
   * Play a sound by its ID
   *
   * @param soundId - The ID of the sound to play from SOUND_MAP
   */
  const playSound = (soundId: keyof typeof SOUND_MAP) => {
    // Create audio element if it doesn't exist
    if (!audioRefs.current[soundId]) {
      const audio = new Audio(SOUND_MAP[soundId]);
      audioRefs.current[soundId] = audio;

      // Reset playing state when audio ends
      audio.addEventListener("ended", () => {
        setIsPlaying((prev) => ({ ...prev, [soundId]: false }));
      });
    }

    const audio = audioRefs.current[soundId];
    if (audio) {
      // Reset and play
      audio.currentTime = 0;
      audio
        .play()
        .catch((error) => console.error("Error playing sound:", error));
      setIsPlaying((prev) => ({ ...prev, [soundId]: true }));
    }
  };

  /**
   * Stop a currently playing sound
   *
   * @param soundId - The ID of the sound to stop
   */
  const stopSound = (soundId: keyof typeof SOUND_MAP) => {
    const audio = audioRefs.current[soundId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying((prev) => ({ ...prev, [soundId]: false }));
    }
  };

  const value = {
    playSound,
    stopSound,
    isPlaying,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

/**
 * Hook to access audio playback functionality
 *
 * @returns AudioContext with playSound and stopSound functions and playing state
 * @throws Error if used outside of AudioProvider
 */
export function useAudio() {
  const context = useContext(AudioContext);

  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }

  return context;
}
