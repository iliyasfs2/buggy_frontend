"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Snowflake } from "lucide-react";

export interface StreakPopoverProps {
  currentStreak: number;
  hasCompletedToday: boolean;
  activeDaysOfWeek: number[]; 
  freezeCount: number;
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

export function StreakPopover({
  currentStreak,
  hasCompletedToday,
  activeDaysOfWeek,
  freezeCount,
  isOpen,
  onClose,
}: StreakPopoverProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const currentDayIndex = new Date().getDay(); 

  return (
    <AnimatePresence>
      {isOpen && (
        <>
                    <div 
            className="fixed inset-0 z-[60] bg-transparent" 
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-14 sm:top-16 right-0 z-[70] w-[320px] bg-slate-900 border border-slate-700/60 border-b-4 border-slate-950 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(249,115,22,0.15)] flex flex-col origin-top-right"
          >
                        <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-20 h-20 relative mb-2 flex items-center justify-center drop-shadow-[0_0_25px_rgba(249,115,22,0.5)]">
                <img src="/icons/streak.png" alt="Streak" className={`w-16 h-16 object-contain ${hasCompletedToday ? "" : "grayscale opacity-50"}`} />
                <span className="absolute inset-0 flex items-center justify-center pt-2 font-black text-2xl text-white drop-shadow-md">
                  {currentStreak}
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-100 mb-1">
                {currentStreak} Day Streak
              </h3>
              <p className="text-[13px] font-medium text-slate-400">
                {hasCompletedToday 
                  ? "Today's streak is secured! 🔥" 
                  : "Complete a lesson today to keep your streak alive!"}
              </p>
            </div>

                        <div className="flex justify-between items-center bg-slate-950/50 rounded-2xl p-4 mb-4 border border-slate-800/50">
              {DAYS_OF_WEEK.map((dayLabel, index) => {
                const isPast = index <= currentDayIndex;
                const isToday = index === currentDayIndex;
                const isActive = activeDaysOfWeek.includes(index);
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase ${isToday ? "text-orange-400" : "text-slate-500"}`}>
                      {dayLabel}
                    </span>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        isActive 
                          ? "bg-orange-500/20 border-orange-500 text-orange-500" 
                          : isToday
                            ? "bg-slate-800 border-slate-600 border-dashed"
                            : isPast
                              ? "bg-slate-800 border-slate-700 text-slate-500"
                              : "bg-transparent border-slate-800/50 text-slate-700"
                      } ${isToday && !hasCompletedToday ? "animate-pulse" : ""}`}
                    >
                      {isActive ? (
                        <img src="/icons/streak.png" alt="Streak" className="w-4 h-4 object-contain" />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

                        <div className="flex items-center justify-between px-2 mb-6">
              <div className="flex items-center gap-2">
                <Snowflake className={`w-5 h-5 ${freezeCount > 0 ? "text-sky-400 fill-sky-400/20" : "text-slate-600"}`} />
                <span className="text-sm font-bold text-slate-300">Streak Freeze</span>
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-md ${freezeCount > 0 ? "bg-sky-500/10 text-sky-400" : "bg-slate-800 text-slate-500"}`}>
                {freezeCount > 0 ? `${freezeCount} Active` : "Inactive"}
              </span>
            </div>

                        <button
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 active:translate-y-1 border-b-4 border-slate-900 active:border-b-[0px] text-slate-200 font-black text-[14px] uppercase tracking-wider transition-all cursor-pointer shadow-md"
            >
              Set New Record
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
