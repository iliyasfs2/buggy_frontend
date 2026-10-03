"use client";

import type { ReactElement } from "react";
import {
  useNavStore,
  selectStreakCount,
  selectByteBalance,
  selectBatteryCount
} from "@/store/useNavStore";
import { StatBadge, BuggyLogo } from "@/components/shared";

export interface DesktopHeaderProps {
  className?: string;
}

export function DesktopHeader({ className = "" }: DesktopHeaderProps): ReactElement {
  const streakCount = useNavStore(selectStreakCount);
  const byteBalance = useNavStore(selectByteBalance);
  const batteryCount = useNavStore(selectBatteryCount);

  return (
    <header
      role="banner"
      aria-label="Desktop Header"
      className={`hidden md:flex relative sticky top-0 z-30 h-16 w-full items-center justify-between px-8 bg-[#101826] border-b-2 border-[#24324a] select-none ${className}`}
    >
      <div className="flex-1" />

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <BuggyLogo className="h-9 w-auto object-contain pointer-events-auto" />
      </div>

      <div className="flex items-center justify-end gap-8 flex-1">
        <StatBadge variant="streak" value={streakCount} />
        <StatBadge variant="byte" value={byteBalance} />
        <StatBadge variant="battery" value={batteryCount} />
      </div>
    </header>
  );
}
