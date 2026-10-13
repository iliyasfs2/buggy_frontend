"use client";

import React, { useState } from "react";
import { useNavStore } from "@/store/useNavStore";
import type { Quest } from "@/services/progressApi";
import { soundEffects } from "@/utils/soundEffects";

const DEFAULT_QUESTS: Quest[] = [
  { id: "q1", title: "Complete 1 lesson", current: 0, target: 1, reward_bytes: 10, claimed: false },
  { id: "q2", title: "Earn 30 XP", current: 0, target: 30, reward_bytes: 15, claimed: false },
  { id: "q3", title: "One flawless lesson", current: 0, target: 1, reward_bytes: 25, claimed: false }
];

export function DailyQuestsCard({ className = "" }: { className?: string }) {
  const dailyQuests = useNavStore((state) => state.dailyQuests);
  const claimQuest = useNavStore((state) => state.claimQuest);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const quests: Quest[] = dailyQuests && dailyQuests.length > 0 ? dailyQuests : DEFAULT_QUESTS;

  const handleClaim = async (questId: string) => {
    if (claimingId) return;
    setClaimingId(questId);
    try {
      soundEffects.playVictory();
      await claimQuest(questId);
    } catch (err) {
      console.error("Failed to claim quest reward:", err);
    } finally {
      setClaimingId(null);
    }
  };

  const renderLeadingIcon = (questId: string) => {
    if (questId === "q2") {
      return (
        <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            <defs>
              <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="url(#boltGrad)" />
          </svg>
        </div>
      );
    }

    if (questId === "q3") {
      return (
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
            <defs>
              <linearGradient id="targetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="9.5" fill="none" stroke="url(#targetGrad)" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="5.5" fill="none" stroke="url(#targetGrad)" strokeWidth="2" />
            <circle cx="12" cy="12" r="2.2" fill="url(#targetGrad)" />
          </svg>
        </div>
      );
    }

    return (
      <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0 shadow-sm">
        <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]">
          <defs>
            <linearGradient id="mascotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <path d="M8 5 Q9.5 8.5 10.5 10" stroke="#38bdf8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="7.5" cy="4.5" r="1.5" fill="#38bdf8" />
          <path d="M16 5 Q14.5 8.5 13.5 10" stroke="#38bdf8" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <circle cx="16.5" cy="4.5" r="1.5" fill="#38bdf8" />
          <ellipse cx="12" cy="13.5" rx="7.5" ry="7" fill="url(#mascotGrad)" />
          <ellipse cx="9.5" cy="12" rx="1.5" ry="2" fill="#ffffff" />
          <ellipse cx="14.5" cy="12" rx="1.5" ry="2" fill="#ffffff" />
          <circle cx="9.5" cy="12.2" r="0.9" fill="#0f172a" />
          <circle cx="14.5" cy="12.2" r="0.9" fill="#0f172a" />
          <path d="M10 16 Q12 18 14 16" stroke="#ffffff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  };

  return (
    <div
      className={`rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-5 shadow-2xl flex flex-col gap-6 select-none relative ${className}`}
    >
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-white font-black text-lg tracking-tight">
          Daily Quests
        </h3>
        <button
          type="button"
          className="text-sky-400 font-extrabold text-xs tracking-wider uppercase hover:text-sky-300 transition-colors cursor-pointer"
        >
          VIEW ALL
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {quests.map((quest) => {
          const isCompleted = quest.current >= quest.target;
          const isClaimed = quest.claimed;
          const canClaim = isCompleted && !isClaimed;
          const percent = Math.min(100, Math.round((quest.current / quest.target) * 100));

          return (
            <div key={quest.id} className="flex items-center gap-3.5">
              {renderLeadingIcon(quest.id)}

              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <span className={`font-bold text-sm truncate ${isClaimed ? "text-slate-400" : "text-slate-100"}`}>
                  {quest.title}
                </span>

                <div className="relative w-full h-5 rounded-full bg-slate-700/60 overflow-hidden flex items-center shadow-inner">
                  <div
                    className="h-full bg-amber-400 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className={`text-xs font-black tracking-tight ${
                        percent >= 55 ? "text-slate-950 font-black" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      }`}
                    >
                      {quest.current} / {quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {isClaimed ? (
                <div className="relative shrink-0 flex items-center justify-center w-12 h-12">
                  <img
                    src="/icons/chest-gold.png"
                    alt="Claimed Chest"
                    className="w-11 h-11 object-contain opacity-50 grayscale-[0.3]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full border-2 border-slate-900 shadow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3 text-slate-950">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              ) : canClaim ? (
                <button
                  type="button"
                  onClick={() => handleClaim(quest.id)}
                  disabled={claimingId === quest.id}
                  title={`Claim ${quest.reward_bytes} Bytes`}
                  className="relative shrink-0 flex items-center justify-center w-12 h-12 group cursor-pointer focus:outline-none transition-transform active:scale-90"
                >
                  <img
                    src="/icons/chest-gold.png"
                    alt="Claim Reward Chest"
                    className="w-12 h-12 object-contain animate-bounce drop-shadow-[0_0_12px_rgba(250,204,21,0.65)] group-hover:scale-110 transition-transform duration-200"
                  />
                  <div className="absolute -top-2 -right-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-amber-200 shadow-lg flex items-center gap-0.5 animate-pulse">
                    <span>+{quest.reward_bytes}</span>
                  </div>
                </button>
              ) : (
                <div className="relative shrink-0 flex items-center justify-center w-12 h-12">
                  <img
                    src="/icons/chest-closed.png"
                    alt="Locked Chest"
                    className="w-11 h-11 object-contain opacity-80"
                  />
                  <div className="absolute -top-1.5 -right-1 bg-slate-800 text-slate-400 text-[10px] font-black px-1.5 py-0.5 rounded-full border border-slate-700 shadow-sm">
                    +{quest.reward_bytes}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
