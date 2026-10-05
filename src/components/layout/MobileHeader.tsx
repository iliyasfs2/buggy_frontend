"use client";

import type { ReactElement } from "react";
import {
  useNavStore,
  selectStreakCount,
  selectByteBalance,
  selectBatteryCount
} from "@/store/useNavStore";
import { StatBadge, BuggyLogo } from "@/components/shared";

export interface MobileHeaderProps {
  className?: string;
}

export function MobileHeader({ className = "" }: MobileHeaderProps): ReactElement {
  const streakCount = useNavStore(selectStreakCount);
  const byteBalance = useNavStore(selectByteBalance);
  const batteryCount = useNavStore(selectBatteryCount);

  return (
    <header
      role="banner"
      aria-label="Mobile Header"
      className={`flex md:hidden sticky top-0 z-40 h-14 w-full items-center justify-between px-4 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 select-none ${className}`}
    >
      <div className="flex items-center">
        <StatBadge variant="battery" value={batteryCount} compact />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <BuggyLogo className="h-7 w-auto object-contain pointer-events-auto" />
      </div>

      <div className="flex items-center gap-3">
        <StatBadge variant="streak" value={streakCount} compact />
        <StatBadge variant="byte" value={byteBalance} compact />
      </div>
    </header>
  );
}
