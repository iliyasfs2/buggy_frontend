"use client";

import React, { useState, type ReactElement } from "react";
import {
  useGameStore,
  selectStreakCount,
  selectByteBalance,
  selectBattery,
  selectHasCompletedToday
} from "@/store/useGameStore";
import { StatBadge, StreakPopover, BatteryPopover, BytePopover, CoursePopover } from "@/components/shared";
import { getCourseConfig } from "@/constants/courses";

export interface DesktopMetricBarProps {
  className?: string;
  inline?: boolean;
}

export function DesktopMetricBar({ className = "", inline = true }: DesktopMetricBarProps): ReactElement {
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [isBatteryOpen, setIsBatteryOpen] = useState(false);
  const [isByteOpen, setIsByteOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  
  const streakCount = useGameStore(selectStreakCount);
  const hasCompletedToday = useGameStore(selectHasCompletedToday);
  const byteBalance = useGameStore(selectByteBalance);
  const batteryCount = useGameStore(selectBattery);
  const activeCourse = useGameStore((state) => state.activeCourse);
  const currentCourse = getCourseConfig(activeCourse);
  const buyStoreItem = useGameStore((state) => state.buyStoreItem);

  const handleRefillBytes = async () => {
    try {
      await buyStoreItem("refill_battery");
      setIsBatteryOpen(false);
    } catch {
      alert("Not enough bytes or battery is already full!");
    }
  };

  const wrapperClass = inline
    ? `flex items-center gap-6 select-none ${className}`
    : `hidden md:flex fixed top-6 right-8 z-30 items-center gap-6 select-none ${className}`;

  return (
    <div
      role="region"
      aria-label="Account Stats"
      className={wrapperClass}
    >
      <div className="relative">
        <StatBadge 
          variant={currentCourse.badgeVariant} 
          value={currentCourse.shortLabel} 
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
    </div>
  );
}
