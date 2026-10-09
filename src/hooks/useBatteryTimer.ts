import { useState, useEffect } from 'react';
import { useNavStore, selectBatteryCount } from '@/store/useNavStore';

export function useBatteryTimer(refillMinutes: number = 15) {
  const currentBattery = useNavStore(selectBatteryCount);
  const rechargeBattery = useNavStore((state) => state.rechargeBattery);
  
  const [timeLeft, setTimeLeft] = useState(refillMinutes * 60);

  useEffect(() => {
    if (currentBattery >= 5) {
      setTimeLeft(refillMinutes * 60);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          rechargeBattery();
          return refillMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentBattery, refillMinutes, rechargeBattery]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedTime;
}
