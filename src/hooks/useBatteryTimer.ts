import { useEffect } from "react";
import {
  useGameStore,
  selectBattery,
  selectSecondsUntilNextRefill,
} from "@/store/useGameStore";

export function useBatteryTimer(refillMinutes: number = 30) {
  const battery = useGameStore(selectBattery);
  const secondsUntilNextRefill = useGameStore(selectSecondsUntilNextRefill);
  const decrementRefillTimer = useGameStore(
    (state) => state.decrementRefillTimer
  );
  const rechargeBattery = useGameStore((state) => state.rechargeBattery);

  useEffect(() => {
    if (battery >= 5) {
      return;
    }

    const interval = setInterval(() => {
      const currentSeconds = useGameStore.getState().secondsUntilNextRefill;
      const currentBattery = useGameStore.getState().battery;

      if (currentBattery >= 5) {
        return;
      }

      decrementRefillTimer();

      if (currentSeconds <= 1 && currentBattery < 5) {
        rechargeBattery();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [battery, decrementRefillTimer, rechargeBattery]);

  if (battery >= 5) {
    return "FULL";
  }

  const effectiveSeconds =
    secondsUntilNextRefill > 0 ? secondsUntilNextRefill : refillMinutes * 60;
  const minutes = Math.floor(effectiveSeconds / 60);
  const seconds = effectiveSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
