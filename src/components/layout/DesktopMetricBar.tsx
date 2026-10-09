"use client";

import React, { useState, type ReactElement } from "react";
import {
  useNavStore,
  selectStreakCount,
  selectByteBalance,
  selectBatteryCount,
  selectHasCompletedToday
} from "@/store/useNavStore";
import { StatBadge, StreakPopover, BatteryPopover, BytePopover, CoursePopover } from "@/components/shared";

export interface DesktopMetricBarProps {
  className?: string;
}

export function DesktopMetricBar({ className = "" }: DesktopMetricBarProps): ReactElement {
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [isBatteryOpen, setIsBatteryOpen] = useState(false);
  const [isByteOpen, setIsByteOpen] = useState(false);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  
  const streakCount = useNavStore(selectStreakCount);
  const hasCompletedToday = useNavStore(selectHasCompletedToday);
  const byteBalance = useNavStore(selectByteBalance);
  const batteryCount = useNavStore(selectBatteryCount);
  const activeCourse = useNavStore((state) => state.activeCourse);
    const setBatteryCount = useNavStore((state) => state.setBatteryCount);
  const setByteBalance = useNavStore((state) => state.setByteBalance);
  const handleRefillBytes = () => {
    if (byteBalance >= 350) {
      setByteBalance(byteBalance - 350);
      setBatteryCount(5);
      setIsBatteryOpen(false);
    } else {
      alert("Not enough bytes!");
    }
  };

  return (
    <aside
      aria-label="Account Stats"
      className={`hidden md:flex fixed top-6 right-8 z-30 items-center gap-6 select-none ${className}`}
    >
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
    </aside>
  );
}
