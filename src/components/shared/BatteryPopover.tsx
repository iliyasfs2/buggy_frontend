"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBatteryTimer } from "@/hooks/useBatteryTimer";
import { Zap, Clock, ShieldCheck } from "lucide-react";

export interface BatteryPopoverProps {
  currentBattery: number;
  isOpen: boolean;
  onClose: () => void;
  onRefillWithBytes: () => void;
  onRefillWithPractice: () => void;
}

export function BatteryPopover({
  currentBattery,
  isOpen,
  onClose,
  onRefillWithBytes,
  onRefillWithPractice,
}: BatteryPopoverProps) {
  const formattedTime = useBatteryTimer(15);
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-transparent" onClick={onClose} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-14 sm:top-16 right-0 z-[70] w-[320px] bg-slate-900 border border-slate-700/60 border-b-4 border-slate-950 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(16,185,129,0.15)] flex flex-col origin-top-right"
          >
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="flex gap-1.5 justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-12 rounded-sm border-2 ${
                      i < currentBattery 
                        ? "bg-emerald-500 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                        : "bg-slate-800 border-slate-700"
                    }`}
                  />
                ))}
              </div>
              <h3 className="text-xl font-black text-slate-100 mb-1">
                {currentBattery === 5 ? "Energy Full!" : `${currentBattery} Energy Left`}
              </h3>
              <div className="flex items-center gap-1.5 text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-full mt-2">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold font-mono">Next refill: {currentBattery === 5 ? "MAX" : formattedTime}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={onRefillWithBytes}
                disabled={currentBattery === 5}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-[14px] uppercase tracking-wider transition-all shadow-md flex items-center justify-between ${
                  currentBattery === 5
                    ? "bg-slate-800 text-slate-500 border-b-4 border-slate-900 cursor-not-allowed"
                    : "bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 active:border-b-[0px] text-white cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className={`w-5 h-5 ${currentBattery === 5 ? "fill-slate-500" : "fill-white"}`} />
                  Refill Energy
                </div>
                {currentBattery < 5 && <span className="text-sky-200 text-xs">350 Bytes</span>}
              </button>

              <button
                onClick={onRefillWithPractice}
                disabled={currentBattery === 5}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-[14px] uppercase tracking-wider transition-all shadow-md flex items-center justify-between ${
                  currentBattery === 5
                    ? "bg-slate-800 text-slate-500 border-b-4 border-slate-900 cursor-not-allowed"
                    : "bg-amber-500 hover:bg-amber-400 active:translate-y-1 border-b-4 border-amber-700 active:border-b-[0px] text-slate-900 cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${currentBattery === 5 ? "text-slate-500" : "text-slate-900"}`} />
                  Practice
                </div>
                {currentBattery < 5 && <span className="text-amber-900 text-xs">+1 Energy</span>}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
