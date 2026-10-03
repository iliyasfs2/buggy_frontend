"use client";

import type { ReactElement } from "react";
import {
  useNavStore,
  selectStreakCount,
  selectByteBalance,
  selectBatteryCount
} from "@/store/useNavStore";
import { StatBadge } from "@/components/shared";

export interface DesktopMetricBarProps {
  className?: string;
}

export function DesktopMetricBar({ className = "" }: DesktopMetricBarProps): ReactElement {
  const streakCount = useNavStore(selectStreakCount);
  const byteBalance = useNavStore(selectByteBalance);
  const batteryCount = useNavStore(selectBatteryCount);

  return (
    <aside
      aria-label="Account Stats"
      className={`hidden md:flex fixed top-6 right-8 z-30 items-center gap-6 select-none ${className}`}
    >
      <StatBadge variant="battery" value={batteryCount} />
      <StatBadge variant="byte" value={byteBalance} />
      <StatBadge variant="streak" value={streakCount} />
    </aside>
  );
}
