"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  useNavStore,
  selectByteBalance,
  selectBatteryCount,
  selectStreakFreezeCount,
} from "@/store/useNavStore";
import { soundEffects } from "@/utils/soundEffects";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  iconType: "battery" | "freeze" | "unlimited";
  iconSrc?: string;
  maxCap?: number;
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: "refill_battery",
    name: "Refill Battery",
    description: "Fully recharge your energy back to 5/5 so you can practice code without delay.",
    price: 100,
    iconType: "battery",
    iconSrc: "/icons/battery.png",
    maxCap: 5,
  },
  {
    id: "streak_freeze",
    name: "Streak Freeze",
    description: "Equip an ice shield to protect your streak if you miss completing a lesson tomorrow.",
    price: 200,
    iconType: "freeze",
    maxCap: 2,
  },
];

export function StoreView() {
  const byteBalance = useNavStore(selectByteBalance);
  const batteryCount = useNavStore(selectBatteryCount);
  const streakFreezeCount = useNavStore(selectStreakFreezeCount);
  const buyStoreItem = useNavStore((state) => state.buyStoreItem);

  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const handleBuy = async (item: StoreItem) => {
    if (purchasingId) return;

    if (item.id === "refill_battery" && batteryCount >= 5) {
      soundEffects.playIncorrect();
      setErrorToast("Battery is already full!");
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    if (item.id === "streak_freeze" && streakFreezeCount >= 2) {
      soundEffects.playIncorrect();
      setErrorToast("You already have the maximum number of Streak Freezes (2)!");
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    if (byteBalance < item.price) {
      soundEffects.playIncorrect();
      setErrorToast(`Not enough Bytes. You need ${item.price} Bytes to purchase this.`);
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    soundEffects.playSoftClick();
    setPurchasingId(item.id);
    setErrorToast(null);

    try {
      await buyStoreItem(item.id);
      soundEffects.playVictory();
      setSuccessToast(`Successfully purchased ${item.name}!`);
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

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 flex flex-col gap-6 select-none relative">
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm shadow-2xl flex items-center gap-2 border-2 border-emerald-400"
          >
            <span>✓</span>
            <span>{successToast}</span>
          </motion.div>
        )}

        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-rose-500 text-white font-black text-sm shadow-2xl flex items-center gap-2 border-2 border-rose-400"
          >
            <span>✕</span>
            <span>{errorToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 flex items-center justify-center p-3 shrink-0 shadow-inner">
            <Image
              src="/icons/byte.png"
              alt="Byte Coins"
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Byte Store
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-1 max-w-xs">
              Spend your Bytes on power-ups and streak protection.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end gap-2 relative z-10 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            <Image
              src="/icons/byte.png"
              alt="Byte"
              width={20}
              height={20}
              className="w-5 h-5 object-contain"
            />
            <span className="text-xl font-black text-amber-400 font-mono">
              {byteBalance}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bytes
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300">
              ⚡ {batteryCount}/5 Energy
            </span>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-300">
              ❄️ {streakFreezeCount}/2 Freezes
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 px-1">
          Power-Ups
        </h2>

        {STORE_ITEMS.map((item) => {
          const isBattery = item.id === "refill_battery";
          const isFreeze = item.id === "streak_freeze";

          const isBatteryFull = isBattery && batteryCount >= 5;
          const isFreezeMaxed = isFreeze && streakFreezeCount >= 2;
          const isAffordable = byteBalance >= item.price;
          const isDisabled = isBatteryFull || isFreezeMaxed || !isAffordable || purchasingId === item.id;

          return (
            <div
              key={item.id}
              className="relative w-full rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 transition-all hover:border-slate-700/90"
            >
              <div className="flex items-center gap-4.5 w-full sm:w-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 p-3 shadow-inner">
                  {isBattery ? (
                    <Image
                      src="/icons/battery.png"
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-2xl shadow-sm">
                      ❄️
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white tracking-tight">
                      {item.name}
                    </h3>

                    {isBatteryFull && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Full
                      </span>
                    )}

                    {isFreezeMaxed && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        Max (2/2)
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 mt-0.5">
                    {isBattery && (
                      <span className="text-[11px] font-bold text-slate-500">
                        Current: <strong className="text-slate-300">{batteryCount}/5</strong>
                      </span>
                    )}
                    {isFreeze && (
                      <span className="text-[11px] font-bold text-slate-500">
                        Equipped: <strong className="text-slate-300">{streakFreezeCount}/2</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  disabled={isDisabled}
                  className={`w-full sm:w-auto min-w-[130px] px-5 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isBatteryFull || isFreezeMaxed
                      ? "bg-slate-800 text-slate-500 border-b-4 border-slate-950 cursor-not-allowed opacity-75"
                      : !isAffordable
                      ? "bg-slate-800 text-slate-500 border-b-4 border-slate-950 cursor-not-allowed opacity-60"
                      : isBattery
                      ? "bg-amber-400 hover:bg-amber-300 active:translate-y-1 active:border-b-0 border-b-4 border-amber-600 text-slate-950 shadow-lg shadow-amber-500/10"
                      : "bg-sky-400 hover:bg-sky-300 active:translate-y-1 active:border-b-0 border-b-4 border-sky-600 text-slate-950 shadow-lg shadow-sky-500/10"
                  }`}
                >
                  {purchasingId === item.id ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : isBatteryFull ? (
                    <span>Full Energy</span>
                  ) : isFreezeMaxed ? (
                    <span>Max Capacity</span>
                  ) : (
                    <>
                      <Image
                        src="/icons/byte.png"
                        alt="Byte"
                        width={18}
                        height={18}
                        className="w-4 h-4 object-contain"
                      />
                      <span>{item.price} Bytes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        <div className="relative w-full rounded-3xl bg-slate-900/40 border-2 border-slate-800/50 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 opacity-70">
          <div className="flex items-center gap-4.5">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center shrink-0 text-3xl">
              ⚡
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-300 tracking-tight">
                  Unlimited Battery Pass
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 leading-relaxed">
                Unlimited energy with zero deductions on wrong submissions.
              </p>
            </div>
          </div>
          <button
            disabled
            className="w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-xs uppercase bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed"
          >
            Locked
          </button>
        </div>
      </div>
    </div>
  );
}
