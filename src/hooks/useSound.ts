"use client";
import { useCallback, useRef, useEffect } from "react";

export function useSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Only initialize if window exists
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(src);
      // Preload
      audioRef.current.load();
    }
  }, [src]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Ignore autoplay or missing file errors silently
      });
    }
  }, []);

  return play;
}
