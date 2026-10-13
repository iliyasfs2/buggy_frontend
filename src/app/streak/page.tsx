"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useNavStore, selectStreakCount, selectHasCompletedToday } from "@/store/useNavStore";
import { DailyQuestsCard } from "@/components/quests/DailyQuestsCard";

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

export default function StreakPage() {
  const router = useRouter();
  const currentStreak = useNavStore(selectStreakCount);
  
  const hasCompletedToday = useNavStore(selectHasCompletedToday);
  const activeDaysOfWeek = [1, 3, 4];
  const freezeCount = 1;
  const currentDayIndex = new Date().getDay();

  return (
    <div className="min-h-screen bg-[#121118] flex flex-col relative overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-orange-500/15 blur-[120px] rounded-full pointer-events-none" />

            <header className="flex items-center justify-between p-6 relative z-10">
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">Streak</h1>
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-slate-800/80 hover:bg-slate-700 rounded-full flex items-center justify-center transition-colors shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-slate-400">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </header>

            <main className="flex-1 flex flex-col px-6 pt-2 pb-12 relative z-10 max-w-md mx-auto w-full">
        
                <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-40 h-40 relative mb-2 flex items-center justify-center drop-shadow-[0_0_50px_rgba(249,115,22,0.5)]"
          >
                        <img 
              src="/icons/streak.png" 
              alt="Streak" 
              className={`w-full h-full object-contain drop-shadow-2xl ${hasCompletedToday ? "animate-pulse" : "opacity-80 grayscale-[0.2]"}`} 
            />
            <span className="absolute inset-0 flex items-center justify-center pt-8 font-black text-5xl text-white drop-shadow-xl tracking-tight">
              {currentStreak}
            </span>
          </motion.div>
          
          <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-1">
            {hasCompletedToday ? "Streak Active!" : "Keep it burning!"}
          </h2>
          <p className="text-orange-400/80 font-bold text-center text-[15px] uppercase tracking-widest">
            {currentStreak} Days
          </p>
        </div>

                <div className="bg-[#1a1824]/80 border border-slate-800 rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex justify-between items-center">
            {DAYS_OF_WEEK.map((dayLabel, index) => {
              const isPast = index <= currentDayIndex;
              const isToday = index === currentDayIndex;
              const isActive = activeDaysOfWeek.includes(index);
              
              return (
                <div key={index} className="flex flex-col items-center gap-3">
                  <span className={`text-xs font-black uppercase ${isToday ? "text-orange-400" : "text-slate-600"}`}>
                    {dayLabel}
                  </span>
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      isActive 
                        ? "bg-gradient-to-tr from-orange-600 to-amber-400 border-amber-300 shadow-[0_0_15px_rgba(249,115,22,0.4)]" 
                        : isToday
                          ? "bg-slate-800 border-slate-500 border-dashed"
                          : isPast
                            ? "bg-[#121118] border-slate-800"
                            : "bg-transparent border-slate-800/50"
                    }`}
                  >
                    {isActive && (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M12 2c0 0-6 7.5-6 12.5a6 6 0 0 0 12 0C18 9.5 12 2 12 2z"/></svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

                <div className="bg-[#1a1824]/80 border border-slate-800 rounded-3xl p-5 mb-8 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-6 h-6 text-sky-400">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07"/>
              </svg>
            </div>
            <div>
              <h4 className="text-slate-100 font-black text-lg tracking-tight">Streak Freeze</h4>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mt-1">Protects your streak</p>
            </div>
          </div>
          <span className={`text-sm font-black px-4 py-2 rounded-xl ${freezeCount > 0 ? "bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-inner" : "bg-slate-800 text-slate-500"}`}>
            {freezeCount > 0 ? `${freezeCount} Active` : "None"}
          </span>
        </div>

        <DailyQuestsCard className="mb-6" />

        <div className="mt-auto">
          <button
            onClick={() => router.back()}
            className="w-full py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 active:translate-y-1 border-b-4 border-orange-700 active:border-b-0 text-slate-950 shadow-[0_10px_20px_-10px_rgba(249,115,22,0.6)]"
          >
            Continue Let&apos;s Go
          </button>
        </div>
      </main>
    </div>
  );
}
