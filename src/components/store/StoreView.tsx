"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shirt, Sparkles, Check, Flame } from "lucide-react";
import {
  useNavStore,
  selectByteBalance,
  selectBatteryCount,
  selectStreakFreezeCount,
} from "@/store/useNavStore";
import { fetchUserProgress } from "@/services/progressApi";
import { soundEffects } from "@/utils/soundEffects";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";

const BATTERY_REFILL_PRICE = 100;
const STREAK_FREEZE_PRICE = 200;
const MAX_BATTERY = 5;

export function StoreView() {
  const byteBalance = useNavStore(selectByteBalance);
  const batteryCount = useNavStore(selectBatteryCount);
  const streakFreezeCount = useNavStore(selectStreakFreezeCount);
  const buyStoreItem = useNavStore((state) => state.buyStoreItem);
  const syncNav = useNavStore((state) => state.syncNav);

  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProgress()
      .then((data) => {
        syncNav(data);
      })
      .catch(() => {});
  }, [syncNav]);

  const handleBuyBattery = async () => {
    if (purchasingId) return;

    if (batteryCount >= MAX_BATTERY) {
      soundEffects.playIncorrect();
      return;
    }

    if (byteBalance < BATTERY_REFILL_PRICE) {
      soundEffects.playIncorrect();
      setErrorToast(`Not enough Bytes! You need ${BATTERY_REFILL_PRICE} Bytes.`);
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    soundEffects.playSoftClick();
    setPurchasingId("refill_battery");
    setErrorToast(null);

    try {
      await buyStoreItem("refill_battery");
      soundEffects.playVictory();
      setSuccessToast("Energy fully recharged to 5/5!");
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: unknown) {
      soundEffects.playIncorrect();
      const message = err instanceof Error ? err.message : "Purchase failed. Please try again.";
      setErrorToast(message);
      setTimeout(() => setErrorToast(null), 3500);
    } finally {
      setPurchasingId(null);
    }
  };

  const handleBuyStreakFreeze = async () => {
    if (purchasingId) return;

    if (streakFreezeCount >= 1) {
      soundEffects.playIncorrect();
      return;
    }

    if (byteBalance < STREAK_FREEZE_PRICE) {
      soundEffects.playIncorrect();
      setErrorToast(`Not enough Bytes! You need ${STREAK_FREEZE_PRICE} Bytes.`);
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    soundEffects.playSoftClick();
    setPurchasingId("streak_freeze");
    setErrorToast(null);

    try {
      await buyStoreItem("streak_freeze");
      soundEffects.playVictory();
      setSuccessToast("Streak Freeze equipped on your account!");
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: unknown) {
      soundEffects.playIncorrect();
      const message = err instanceof Error ? err.message : "Purchase failed. Please try again.";
      setErrorToast(message);
      setTimeout(() => setErrorToast(null), 3500);
    } finally {
      setPurchasingId(null);
    }
  };

  const isBatteryFull = batteryCount >= MAX_BATTERY;
  const canAffordBattery = byteBalance >= BATTERY_REFILL_PRICE;
  const isBatteryDisabled = isBatteryFull || !canAffordBattery || purchasingId === "refill_battery";

  const isFreezeEquipped = streakFreezeCount >= 1;
  const canAffordFreeze = byteBalance >= STREAK_FREEZE_PRICE;
  const isFreezeDisabled = isFreezeEquipped || !canAffordFreeze || purchasingId === "streak_freeze";

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-32 md:pb-16 select-none relative">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col gap-6 shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full">
          <DesktopMetricBar inline />
        </div>

        <AnimatePresence>
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm shadow-2xl flex items-center gap-2 border-2 border-emerald-300 border-b-4 border-b-emerald-700"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{successToast}</span>
            </motion.div>
          )}

          {errorToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-rose-500 text-white font-black text-sm shadow-2xl flex items-center gap-2 border-2 border-rose-400 border-b-4 border-b-rose-700"
            >
              <span>✕</span>
              <span>{errorToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full rounded-2xl bg-[#162238] border-2 border-slate-700/80 border-b-[5px] border-b-slate-950 p-5 sm:p-7 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-sky-400/10 blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 sm:gap-5 relative z-10 w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/15 border-2 border-amber-400/35 border-b-4 border-b-amber-600/40 flex items-center justify-center p-3 shrink-0 shadow-inner">
              <Image
                src="/icons/byte.png"
                alt="Buggy Store"
                width={64}
                height={64}
                className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(251,191,36,0.35)]"
              />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Buggy Store
              </h1>
              <p className="text-xs sm:text-sm font-bold text-slate-300 leading-relaxed">
                Use your Bytes to refill your energy and protect your daily streak!
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full rounded-2xl bg-slate-900/95 border-2 border-slate-800 border-b-4 border-b-slate-950 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto min-w-0">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/25 flex items-center justify-center shrink-0 p-3.5 shadow-inner">
                <Image
                  src="/icons/battery.png"
                  alt="Energy Refill"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                />
              </div>

              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Full Energy Refill
                </h2>

                <p className="text-xs sm:text-sm font-bold text-slate-400 leading-snug">
                  Instantly refill all 5 battery bars so you can keep solving challenges without stopping.
                </p>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="flex items-center gap-1.5" aria-label={`Battery status: ${batteryCount} out of 5`}>
                    {Array.from({ length: MAX_BATTERY }).map((_, idx) => {
                      const isFilled = idx < batteryCount;
                      return (
                        <div
                          key={idx}
                          className={`w-6 h-2.5 rounded-sm transition-all ${
                            isFilled
                              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]"
                              : "bg-slate-800 border border-slate-700"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {batteryCount}/{MAX_BATTERY}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
              <button
                type="button"
                onClick={handleBuyBattery}
                disabled={isBatteryDisabled}
                className={`w-full sm:w-auto min-w-[148px] px-5 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all select-none ${
                  isBatteryFull
                    ? "bg-slate-800/80 text-slate-500 border-2 border-slate-700/60 cursor-not-allowed"
                    : !canAffordBattery
                    ? "bg-slate-800/90 text-rose-400 border-2 border-slate-700/80 cursor-not-allowed"
                    : "bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 border-2 border-emerald-400 border-b-4 border-b-emerald-700 active:border-b-2 text-slate-950 cursor-pointer shadow-lg shadow-emerald-500/10"
                }`}
              >
                {purchasingId === "refill_battery" ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isBatteryFull ? (
                  <span>Energy is Full</span>
                ) : (
                  <>
                    <Image
                      src="/icons/byte.png"
                      alt="Bytes"
                      width={18}
                      height={18}
                      className="w-4 h-4 object-contain shrink-0"
                    />
                    <span className={!canAffordBattery ? "text-rose-400 font-black" : "text-slate-950 font-black"}>
                      {BATTERY_REFILL_PRICE}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="w-full rounded-2xl bg-slate-900/95 border-2 border-slate-800 border-b-4 border-b-slate-950 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all">
            <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full sm:w-auto min-w-0">
              <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border-2 border-sky-500/25 flex items-center justify-center shrink-0 p-3.5 shadow-inner relative">
                <div className="relative flex items-center justify-center">
                  <Flame className="w-11 h-11 text-sky-400 fill-sky-400/80 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]" />
                  <Sparkles className="w-4 h-4 text-cyan-200 absolute -top-1 -right-1.5" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                    Streak Freeze
                  </h2>

                  {isFreezeEquipped ? (
                    <span className="text-[11px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300">
                      Equipped ✓
                    </span>
                  ) : (
                    <span className="text-[11px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                      Stock: 0 / 1
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-400 leading-snug">
                  If you miss a day of practice for any reason, your streak won&apos;t burn and stays intact.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
              <button
                type="button"
                onClick={handleBuyStreakFreeze}
                disabled={isFreezeDisabled}
                className={`w-full sm:w-auto min-w-[148px] px-5 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all select-none ${
                  isFreezeEquipped
                    ? "bg-sky-500/10 text-sky-300 border-2 border-sky-500/40 cursor-not-allowed"
                    : !canAffordFreeze
                    ? "bg-slate-800/90 text-rose-400 border-2 border-slate-700/80 cursor-not-allowed"
                    : "bg-sky-400 hover:bg-sky-300 active:translate-y-1 border-2 border-sky-300 border-b-4 border-b-sky-600 active:border-b-2 text-slate-950 cursor-pointer shadow-lg shadow-sky-500/10"
                }`}
              >
                {purchasingId === "streak_freeze" ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isFreezeEquipped ? (
                  <span>Active on Account</span>
                ) : (
                  <>
                    <Image
                      src="/icons/byte.png"
                      alt="Bytes"
                      width={18}
                      height={18}
                      className="w-4 h-4 object-contain shrink-0"
                    />
                    <span className={!canAffordFreeze ? "text-rose-400 font-black" : "text-slate-950 font-black"}>
                      {STREAK_FREEZE_PRICE}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400 px-1">
            Coming Soon to Store
          </h3>

          <div className="w-full rounded-2xl bg-slate-900/40 border-2 border-dashed border-slate-800 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-60">
            <div className="flex items-center gap-4 sm:gap-5 w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800/70 border-2 border-slate-700/70 flex items-center justify-center shrink-0 relative">
                <Shirt className="w-8 h-8 sm:w-9 sm:h-9 text-slate-300 stroke-[2]" />
                <div className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 absolute -bottom-1.5 -right-1.5 shadow-md">
                  <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <h4 className="text-base sm:text-lg font-black text-slate-200 tracking-tight">
                  Avatar Customization &amp; Items
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-400 leading-relaxed">
                  Outfits and cosmetic items for the Buggy character — unlocking in upcoming updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center sticky top-8">
        <DesktopMetricBar inline />
      </div>
    </div>
  );
}
