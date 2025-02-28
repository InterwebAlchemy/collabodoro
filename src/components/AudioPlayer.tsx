import { useEffect } from "react";
import { SOUND_MAP } from "../constants/audio";
import { useAudio } from "../contexts/AudioContext";

export interface AudioPlayerProps {
  soundId: keyof typeof SOUND_MAP;
  shouldPlay?: boolean;
}

/**
 * Component that plays an audio file when shouldPlay is true
 *
 * @param soundId - The ID of the sound to play from SOUND_MAP
 * @param shouldPlay - Optional flag to control when the sound should play
 */
export default function AudioPlayer({
  soundId,
  shouldPlay = true,
}: AudioPlayerProps) {
  const { playSound, stopSound } = useAudio();

  useEffect(() => {
    if (shouldPlay) {
      playSound(soundId);
    } else {
      stopSound(soundId);
    }

    // Clean up on unmount
    return () => {
      stopSound(soundId);
    };
  }, [soundId, shouldPlay, playSound, stopSound]);

  // Component doesn't render anything visible
  return null;
}
