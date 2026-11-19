"use client";

import React, { useState } from "react";
import { BookOpen, Zap, Target, Check } from "lucide-react";
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
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-sm text-amber-400">
          <Zap className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
        </div>
      );
    }

    if (questId === "q3") {
      return (
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm text-emerald-400">
          <Target className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-sm text-sky-400">
        <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
      </div>
    );
  };

  return (
    <div
      className={`rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 p-6 sm:p-7 shadow-2xl flex flex-col gap-6 select-none relative ${className}`}
    >
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-white font-black text-xl tracking-tight">
          Daily Quests
        </h3>
        <button
          type="button"
          className="text-sky-400 font-extrabold text-xs sm:text-sm tracking-wider uppercase hover:text-sky-300 transition-colors cursor-pointer"
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
            <div key={quest.id} className="flex items-center gap-4">
              {renderLeadingIcon(quest.id)}

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <span className={`font-black text-sm sm:text-base break-words leading-snug ${isClaimed ? "text-slate-400" : "text-slate-100"}`}>
                  {quest.title}
                </span>

                <div className="relative w-full h-6 rounded-full bg-slate-700/60 overflow-hidden flex items-center shadow-inner">
                  <div
                    className="h-full bg-amber-400 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className={`text-xs sm:text-sm font-black tracking-tight ${
                        percent >= 55 ? "text-slate-950 font-black" : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      }`}
                    >
                      {quest.current} / {quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {isClaimed ? (
                <div className="relative shrink-0 flex items-center justify-center w-14 h-14">
                  <img
                    src="/icons/chest-gold.png"
                    alt="Claimed Chest"
                    className="w-12 h-12 object-contain opacity-50 grayscale-[0.3]"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full border-2 border-slate-900 shadow">
                    <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3.5} />
                  </div>
                </div>
              ) : canClaim ? (
                <button
                  type="button"
                  onClick={() => handleClaim(quest.id)}
                  disabled={claimingId === quest.id}
                  title={`Claim ${quest.reward_bytes} Bytes`}
                  className="relative shrink-0 flex items-center justify-center w-14 h-14 group cursor-pointer focus:outline-none transition-transform active:scale-90"
                >
                  <img
                    src="/icons/chest-gold.png"
                    alt="Claim Reward Chest"
                    className="w-[52px] h-[52px] object-contain animate-bounce drop-shadow-[0_0_12px_rgba(250,204,21,0.65)] group-hover:scale-110 transition-transform duration-200"
                  />
                  <div className="absolute -top-2 -right-1 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-[11px] font-black px-2 py-0.5 rounded-full border border-amber-200 shadow-lg flex items-center gap-0.5 animate-pulse">
                    <span>+{quest.reward_bytes}</span>
                  </div>
                </button>
              ) : (
                <div className="relative shrink-0 flex items-center justify-center w-14 h-14">
                  <img
                    src="/icons/chest-closed.png"
                    alt="Locked Chest"
                    className="w-12 h-12 object-contain opacity-80"
                  />
                  <div className="absolute -top-1.5 -right-1 bg-slate-800 text-slate-400 text-[11px] font-black px-2 py-0.5 rounded-full border border-slate-700 shadow-sm">
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
