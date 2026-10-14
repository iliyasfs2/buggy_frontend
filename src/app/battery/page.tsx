"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBatteryTimer } from "@/hooks/useBatteryTimer";
import { useNavStore, selectBatteryCount, selectByteBalance } from "@/store/useNavStore";

export default function BatteryPage() {
  const router = useRouter();
  const currentBattery = useNavStore(selectBatteryCount);
  const byteBalance = useNavStore(selectByteBalance);
  const buyStoreItem = useNavStore((state) => state.buyStoreItem);
  const formattedTime = useBatteryTimer(15);

  const handleRefillBytes = async () => {
    if (byteBalance >= 100 && currentBattery < 5) {
      await buyStoreItem("refill_battery");
    }
  };

  return (
    <div className="min-h-screen bg-[#061e16] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-emerald-500/15 blur-[150px] rounded-full pointer-events-none" />

            <header className="flex items-center justify-between p-6 relative z-10">
        <h1 className="text-2xl font-black text-emerald-50 tracking-tight">Energy</h1>
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-emerald-950/80 hover:bg-emerald-900 rounded-full flex items-center justify-center transition-colors shadow-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-500">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </header>

            <main className="flex-1 flex flex-col px-6 pt-2 pb-12 relative z-10 max-w-md mx-auto w-full">
        
                <div className="flex flex-col items-center mb-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-48 mb-8 relative drop-shadow-[0_0_40px_rgba(16,185,129,0.3)]"
          >
                        <img 
              src="/icons/battery.png" 
              alt="Battery" 
              className="w-full h-full object-contain drop-shadow-2xl" 
            />
          </motion.div>
          
          <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-2">
            {currentBattery === 5 ? "Energy Full!" : `${currentBattery} Left`}
          </h2>
          
          <div className="flex items-center gap-2 text-emerald-300 bg-emerald-900/50 px-5 py-2.5 rounded-2xl border border-emerald-500/20 shadow-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="w-5 h-5">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span className="text-base font-black tracking-widest">{currentBattery === 5 ? "FULL" : formattedTime}</span>
          </div>
        </div>

                <div className="flex flex-col gap-5 mt-auto">
          <button
            onClick={handleRefillBytes}
            disabled={currentBattery === 5 || byteBalance < 100}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-between ${
              currentBattery === 5
                ? "bg-slate-800 text-slate-600 border-b-4 border-slate-900 cursor-not-allowed"
                : byteBalance < 100
                  ? "bg-slate-800 text-slate-600 border-b-4 border-slate-900 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:translate-y-1 border-b-4 border-teal-700 active:border-b-0 text-slate-950 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)]"
            }`}
          >
            <div className="flex items-center gap-3">
              Refill Energy
            </div>
            {currentBattery < 5 && (
              <span className={`text-xs px-3 py-1.5 rounded-lg border ${byteBalance >= 100 ? "bg-teal-800/20 border-teal-900 text-teal-950" : "bg-slate-900 border-slate-700 text-slate-500"}`}>
                100 Bytes
              </span>
            )}
          </button>

          <button
            disabled={currentBattery === 5}
            className={`w-full py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-widest transition-all flex items-center justify-center ${
              currentBattery === 5
                ? "bg-slate-800 text-slate-600 border-b-4 border-slate-900 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 active:translate-y-1 border-b-4 border-slate-950 active:border-b-0 text-emerald-400 shadow-md"
            }`}
          >
            Practice to Earn
          </button>
        </div>
      </main>
    </div>
  );
}
