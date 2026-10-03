"use client";

import { useState, useCallback } from "react";
import { useSetupStore } from "@/store/useSetupStore";

export function useSetupInteractions() {
  const [isBuggyHopping, setIsBuggyHopping] = useState<boolean>(false);
  const [isBuggyHappy, setIsBuggyHappy] = useState<boolean>(false);
  const [isMugSipping, setIsMugSipping] = useState<boolean>(false);
  const [isScreenFlickering, setIsScreenFlickering] = useState<boolean>(false);
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; symbol: string; x: number; y: number }[]>([]);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);

  const incrementStats = useSetupStore((state) => state.incrementStats);

  const playTone = useCallback((frequency: number, type: OscillatorType = "sine", duration: number = 0.08) => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      return;
    }
  }, []);

  const triggerHaptic = useCallback((pattern: number | number[] = 10) => {
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      return;
    }
  }, []);

  const handleBuggyClick = useCallback(() => {
    if (isBuggyHopping) return;
    setIsBuggyHopping(true);
    setIsBuggyHappy(true);
    playTone(587.33, "triangle", 0.1);
    setTimeout(() => playTone(880, "sine", 0.12), 80);
    triggerHaptic(15);
    incrementStats("compiledLines", 5);

    const newParticle = {
      id: Date.now(),
      symbol: "❤️",
      x: 10 + Math.random() * 20,
      y: -10
    };
    setFloatingParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setIsBuggyHopping(false);
      setTimeout(() => setIsBuggyHappy(false), 600);
    }, 500);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 850);
  }, [isBuggyHopping, incrementStats, playTone, triggerHaptic]);

  const handleMugClick = useCallback(() => {
    if (isMugSipping) return;
    setIsMugSipping(true);
    playTone(440, "sine", 0.08);
    triggerHaptic(10);
    incrementStats("uptimeHours", 1);

    const newParticle = {
      id: Date.now(),
      symbol: "⚡",
      x: 8 + Math.random() * 15,
      y: -14
    };
    setFloatingParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setIsMugSipping(false);
    }, 450);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 850);
  }, [isMugSipping, incrementStats, playTone, triggerHaptic]);

  const handleScreenClick = useCallback(() => {
    setIsScreenFlickering(true);
    playTone(720, "square", 0.06);
    triggerHaptic(8);
    incrementStats("compiledLines", 15);

    const newParticle = {
      id: Date.now(),
      symbol: "01",
      x: 20 + Math.random() * 20,
      y: -10
    };
    setFloatingParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setIsScreenFlickering(false);
    }, 600);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 850);
  }, [incrementStats, playTone, triggerHaptic]);

  const triggerSnapshot = useCallback(() => {
    playTone(659.25, "triangle", 0.15);
    triggerHaptic([10, 30, 10]);
    setSnapshotToast("Workspace setup configuration copied to clipboard!");
    setTimeout(() => {
      setSnapshotToast(null);
    }, 2800);
  }, [playTone, triggerHaptic]);

  return {
    isBuggyHopping,
    isBuggyHappy,
    isMugSipping,
    isScreenFlickering,
    floatingParticles,
    snapshotToast,
    handleBuggyClick,
    handleMugClick,
    handleScreenClick,
    triggerSnapshot
  };
}
