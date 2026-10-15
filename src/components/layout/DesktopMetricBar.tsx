"use client";

import React, { useState, type ReactElement } from "react";
import Link from "next/link";
import {
  useGameStore,
  selectStreakCount,
  selectByteBalance,
  selectBattery,
  selectHasCompletedToday
} from "@/store/useGameStore";
import { useAuthStore } from "@/store/useAuthStore";
import { StatBadge, StreakPopover, BatteryPopover, BytePopover, CoursePopover } from "@/components/shared";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";

export interface DesktopMetricBarProps {
  className?: string;
}

export function DesktopMetricBar({ className = "" }: DesktopMetricBarProps): ReactElement {
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [isBatteryOpen, setIsBatteryOpen] = useState(false);
  const [isByteOpen, setIsByteOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const streakCount = useGameStore(selectStreakCount);
  const hasCompletedToday = useGameStore(selectHasCompletedToday);
  const byteBalance = useGameStore(selectByteBalance);
  const batteryCount = useGameStore(selectBattery);
  const activeCourse = useGameStore((state) => state.activeCourse);
  const buyStoreItem = useGameStore((state) => state.buyStoreItem);

  const handleRefillBytes = async () => {
    try {
      await buyStoreItem("refill_battery");
      setIsBatteryOpen(false);
    } catch {
      alert("Not enough bytes or battery is already full!");
    }
  };

  return (
    <header
      role="banner"
      aria-label="Desktop Header"
      className={`hidden md:flex fixed top-0 left-64 right-0 h-20 z-40 bg-[#101826]/90 backdrop-blur-md border-b border-slate-800/80 px-8 items-center justify-end select-none ${className}`}
    >
      <div className="flex items-center gap-6">
        <div className="relative">
          <StatBadge 
            variant="js" 
            value={activeCourse === "javascript" ? "JS" : activeCourse === "python" ? "PY" : "React"} 
            onClick={() => setIsCourseOpen(true)}
          />
          <CoursePopover
            activeCourse={activeCourse}
            isOpen={isCourseOpen}
            onClose={() => setIsCourseOpen(false)}
          />
        </div>
        
        <div className="relative">
          <StatBadge 
            variant="battery" 
            value={batteryCount} 
            onClick={() => setIsBatteryOpen(true)}
          />
          <BatteryPopover
            currentBattery={batteryCount}
            isOpen={isBatteryOpen}
            onClose={() => setIsBatteryOpen(false)}
            onRefillWithBytes={handleRefillBytes}
            onRefillWithPractice={() => { alert("Practice mode starting..."); setIsBatteryOpen(false); }}
          />
        </div>

        <div className="relative">
          <StatBadge 
            variant="byte" 
            value={byteBalance} 
            onClick={() => setIsByteOpen(true)}
          />
          <BytePopover
            currentBytes={byteBalance}
            isOpen={isByteOpen}
            onClose={() => setIsByteOpen(false)}
          />
        </div>
        
        <div className="relative">
          <StatBadge 
            variant="streak" 
            value={streakCount} 
            onClick={() => setIsStreakOpen(true)} 
          />
          <StreakPopover 
            currentStreak={streakCount}
            hasCompletedToday={hasCompletedToday}
            activeDaysOfWeek={[1, 3, 4]}
            freezeCount={1}
            isOpen={isStreakOpen}
            onClose={() => setIsStreakOpen(false)}
          />
        </div>

        <Link
          href="/profile"
          aria-label="User Profile"
          className="relative group flex items-center gap-2 pl-2 rounded-2xl py-1 px-1.5 hover:bg-slate-800/60 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-slate-950 border-2 border-slate-700 group-hover:border-blue-400 overflow-hidden shrink-0 flex items-center justify-center transition-colors shadow-sm">
            <AvatarRenderer config={user?.avatar_config || user?.avatar} size={32} />
          </div>
          {user?.username && (
            <span className="text-xs sm:text-sm font-extrabold text-slate-200 group-hover:text-white transition-colors max-w-[120px] truncate hidden xl:inline-block">
              {user.username}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
