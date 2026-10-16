"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Shirt, Check } from "lucide-react";
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
const STREAK_FREEZE_PRICE = 150;
const MAX_BATTERY = 5;
const MAX_STREAK_FREEZE = 2;

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

    if (streakFreezeCount >= MAX_STREAK_FREEZE) {
      soundEffects.playIncorrect();
      setErrorToast(`Monthly limit of ${MAX_STREAK_FREEZE} Streak Freezes reached!`);
      setTimeout(() => setErrorToast(null), 3000);
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
      setSuccessToast("Streak Freeze added to your account!");
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
  const isFreezeFull = streakFreezeCount >= MAX_STREAK_FREEZE;
  const canAffordFreeze = byteBalance >= STREAK_FREEZE_PRICE;

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

        <div className="relative w-full">
          <Image
            src="/images/store-banner.png"
            alt="Buggy Store - Use your bytes to refill your energy and protect your daily streak!"
            width={1902}
            height={566}
            quality={100}
            unoptimized
            priority
            className="w-full h-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] select-none pointer-events-none"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-700 border-b-4 border-b-slate-700 shadow-xl bg-[#04142c] transition-all">
            <Image
              src="/images/energy-refill-banner.png"
              alt="Full Energy Refill Banner"
              width={2910}
              height={687}
              quality={100}
              unoptimized
              priority
              className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-start justify-between gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 pr-[30%] sm:pr-[32%] min-h-[96px] sm:min-h-[132px] md:min-h-[152px]">
              <div className="flex flex-col items-start gap-0.5 sm:gap-1 min-w-0">
                <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-tight drop-shadow-md">
                  Full Energy Refill
                </h2>

                <p className="text-xs md:text-sm font-bold text-slate-200 leading-snug drop-shadow-sm">
                  Instantly refill 5 batteries
                </p>
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  type="button"
                  onClick={handleBuyBattery}
                  disabled={purchasingId !== null}
                  className={`w-[92px] sm:w-[124px] md:w-[136px] px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl font-black text-xs md:text-sm tracking-wide flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-75 select-none cursor-pointer active:translate-y-[3px] md:active:translate-y-[4px] active:border-b-[2px] ${
                    isBatteryFull
                      ? "bg-slate-600 hover:bg-slate-500 text-slate-200 border-2 border-slate-400/70 border-b-[4px] md:border-b-[6px] border-b-slate-800 shadow-md"
                      : !canAffordBattery
                      ? "bg-slate-600 hover:bg-slate-500 text-rose-400 border-2 border-slate-400/70 border-b-[4px] md:border-b-[6px] border-b-slate-800 shadow-md"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-2 border-emerald-300 border-b-[4px] md:border-b-[6px] border-b-emerald-700 shadow-lg shadow-emerald-500/25"
                  }`}
                >
                  {purchasingId === "refill_battery" ? (
                    <span className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Image
                        src="/icons/byte.png"
                        alt="Bytes"
                        width={20}
                        height={20}
                        unoptimized
                        className={`w-3.5 h-3.5 md:w-4 md:h-4 object-contain shrink-0 ${isBatteryFull ? "grayscale opacity-80" : !canAffordBattery ? "opacity-80" : ""}`}
                      />
                      <span className="font-black">
                        {BATTERY_REFILL_PRICE}byte
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-700 border-b-4 border-b-slate-700 shadow-xl bg-[#04142c] transition-all">
            <Image
              src="/images/streak-freeze-banner.png"
              alt="Streak Freeze Banner"
              width={2910}
              height={687}
              quality={100}
              unoptimized
              priority
              className="absolute inset-0 w-full h-full object-cover object-right select-none pointer-events-none"
            />

            <div className="relative z-10 flex flex-col items-start justify-between gap-2 sm:gap-3 p-3 sm:p-4 md:p-5 pr-[30%] sm:pr-[32%] min-h-[96px] sm:min-h-[132px] md:min-h-[152px]">
              <div className="flex flex-col items-start gap-0.5 sm:gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-tight drop-shadow-md">
                    Streak Freeze
                  </h2>

                  <span
                    className={`text-[9px] sm:text-[11px] font-black uppercase tracking-wide px-1.5 sm:px-2 py-0.5 rounded-full backdrop-blur-sm border shrink-0 ${
                      isFreezeFull
                        ? "bg-sky-500/20 border-sky-400/50 text-sky-300"
                        : "bg-slate-950/75 border-slate-700/80 text-slate-300"
                    }`}
                  >
                    {Math.min(streakFreezeCount, MAX_STREAK_FREEZE)}/{MAX_STREAK_FREEZE}
                  </span>
                </div>

                <p className="text-xs md:text-sm font-bold text-slate-200 leading-snug drop-shadow-sm">
                  Prevent losing your streak
                </p>
              </div>

              <div className="shrink-0 flex items-center">
                <button
                  type="button"
                  onClick={handleBuyStreakFreeze}
                  disabled={purchasingId !== null}
                  className={`w-[92px] sm:w-[124px] md:w-[136px] px-3 py-1.5 md:px-4 md:py-2.5 rounded-xl font-black text-xs md:text-sm tracking-wide flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-75 select-none cursor-pointer active:translate-y-[3px] md:active:translate-y-[4px] active:border-b-[2px] ${
                    isFreezeFull
                      ? "bg-slate-600 hover:bg-slate-500 text-slate-200 border-2 border-slate-400/70 border-b-[4px] md:border-b-[6px] border-b-slate-800 shadow-md"
                      : !canAffordFreeze
                      ? "bg-slate-600 hover:bg-slate-500 text-rose-400 border-2 border-slate-400/70 border-b-[4px] md:border-b-[6px] border-b-slate-800 shadow-md"
                      : "bg-sky-400 hover:bg-sky-300 text-slate-950 border-2 border-sky-200 border-b-[4px] md:border-b-[6px] border-b-sky-600 shadow-lg shadow-sky-500/25"
                  }`}
                >
                  {purchasingId === "streak_freeze" ? (
                    <span className="w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Image
                        src="/icons/byte.png"
                        alt="Bytes"
                        width={20}
                        height={20}
                        unoptimized
                        className={`w-3.5 h-3.5 md:w-4 md:h-4 object-contain shrink-0 ${isFreezeFull ? "grayscale opacity-80" : !canAffordFreeze ? "opacity-80" : ""}`}
                      />
                      <span className="font-black">
                        {STREAK_FREEZE_PRICE}byte
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-400 px-1">
            Coming Soon to Store
          </h3>

          <div className="w-full rounded-2xl bg-slate-900/40 border-2 border-dashed border-slate-800 p-3.5 sm:p-6 flex flex-row items-center justify-between gap-3.5 sm:gap-5 opacity-60">
            <div className="flex flex-row items-center gap-3.5 sm:gap-5 w-full">
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl bg-slate-800/70 border-2 border-slate-700/70 flex items-center justify-center shrink-0 relative">
                <Shirt className="w-6 h-6 sm:w-9 sm:h-9 text-slate-300 stroke-[2]" />
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 absolute -bottom-1 -right-1 sm:-bottom-1.5 sm:-right-1.5 shadow-md">
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
                </div>
              </div>

              <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                <h4 className="text-sm sm:text-lg font-black text-slate-200 tracking-tight">
                  Avatar Customization &amp; Items
                </h4>
                <p className="text-xs sm:text-sm font-bold text-slate-400 leading-snug sm:leading-relaxed">
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
