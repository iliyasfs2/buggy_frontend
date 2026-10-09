"use client";
import { useCallback, useRef, useEffect } from "react";

export function useSound(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(src);
      audioRef.current.load();
    }
  }, [src]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
      });
    }
  }, []);

  return play;
}
