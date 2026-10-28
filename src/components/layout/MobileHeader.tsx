"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import {
  useNavStore,
  selectStreakCount,
  selectByteBalance,
  selectBatteryCount
} from "@/store/useNavStore";
import { StatBadge, BuggyLogo } from "@/components/shared";
import { getCourseConfig } from "@/constants/courses";

export interface MobileHeaderProps {
  className?: string;
}

export function MobileHeader({ className = "" }: MobileHeaderProps): ReactElement {
  const streakCount = useNavStore(selectStreakCount);
  const byteBalance = useNavStore(selectByteBalance);
  const batteryCount = useNavStore(selectBatteryCount);
  const activeCourse = useNavStore((state) => state.activeCourse);
  const currentCourse = getCourseConfig(activeCourse);

  return (
    <header
      role="banner"
      aria-label="Mobile Header"
      className={`grid md:hidden sticky top-0 z-40 h-14 w-full grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-3 px-3 min-[400px]:px-4 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 select-none ${className}`}
    >
      <div className="flex items-center justify-start gap-2 min-[400px]:gap-3 min-w-0">
        <Link href="/battery" className="shrink-0 flex items-center">
          <StatBadge variant="battery" value={batteryCount} compact />
        </Link>
        <Link href="/bytes" className="shrink-0 flex items-center">
          <StatBadge variant="byte" value={byteBalance} compact />
        </Link>
      </div>

      <div className="flex items-center justify-center min-w-0">
        <BuggyLogo className="h-[clamp(18px,5.5vw,28px)] w-auto max-w-full object-contain" />
      </div>

      <div className="flex items-center justify-end gap-2 min-[400px]:gap-3 min-w-0 relative">
        <Link href="/courses" className="shrink-0 flex items-center">
          <StatBadge variant={currentCourse.badgeVariant} value={currentCourse.shortLabel} compact />
        </Link>
        
        <Link href="/streak" className="shrink-0 flex items-center">
          <StatBadge variant="streak" value={streakCount} compact />
        </Link>
      </div>
    </header>
  );
}
