import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { SOUND_MAP } from "../constants/audio";
import { getSoundsPreference, SOUNDS_CHANGE_EVENT } from "../utils/sounds";

interface AudioContextProps {
  playSound: (soundId: keyof typeof SOUND_MAP) => void;
  stopSound: (soundId: keyof typeof SOUND_MAP) => void;
  isPlaying: Record<keyof typeof SOUND_MAP, boolean>;
  soundsEnabled: boolean;
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
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<
    Record<keyof typeof SOUND_MAP, boolean>
  >(() => {
    const initialState: Record<string, boolean> = {};

    Object.keys(SOUND_MAP).forEach((key) => {
      initialState[key as keyof typeof SOUND_MAP] = false;
    });

    return initialState as Record<keyof typeof SOUND_MAP, boolean>;
  });

  // Initialize sounds enabled state from localStorage
  useEffect(() => {
    const soundsPreference = getSoundsPreference();
    setSoundsEnabled(soundsPreference === "enabled");

    // Listen for sound preference changes
    const handleSoundsChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newState = customEvent.detail?.soundsState;
      setSoundsEnabled(newState === "enabled");
    };

    window.addEventListener(SOUNDS_CHANGE_EVENT, handleSoundsChange);
    return () => {
      window.removeEventListener(SOUNDS_CHANGE_EVENT, handleSoundsChange);
    };
  }, []);

  /**
   * Play a sound by its ID
   *
   * @param soundId - The ID of the sound to play from SOUND_MAP
   */
  const playSound = (soundId: keyof typeof SOUND_MAP) => {
    // Don't play sounds if sounds are disabled
    if (!soundsEnabled) return;

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
    soundsEnabled,
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
