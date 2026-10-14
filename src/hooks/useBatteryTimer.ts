import { useState, useEffect, useCallback } from "react";
import {
  useNavStore,
  selectBatteryCount,
  selectBatteryRefillAt,
} from "@/store/useNavStore";

export function useBatteryTimer(refillMinutes: number = 15) {
  const currentBattery = useNavStore(selectBatteryCount);
  const batteryRefillAt = useNavStore(selectBatteryRefillAt);
  const rechargeBattery = useNavStore((state) => state.rechargeBattery);

  const calculateTimeLeft = useCallback(() => {
    if (currentBattery >= 5) {
      return 0;
    }
    if (batteryRefillAt) {
      const now = Date.now() / 1000;
      return Math.max(0, Math.ceil(batteryRefillAt - now));
    }
    return refillMinutes * 60;
  }, [currentBattery, batteryRefillAt, refillMinutes]);

  const [timeLeft, setTimeLeft] = useState<number>(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [calculateTimeLeft]);

  useEffect(() => {
    if (currentBattery >= 5) {
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0 && currentBattery < 5) {
        rechargeBattery();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentBattery, calculateTimeLeft, rechargeBattery]);

  if (currentBattery >= 5) {
    return "FULL";
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
