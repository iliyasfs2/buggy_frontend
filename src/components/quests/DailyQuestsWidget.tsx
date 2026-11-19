"use client";

import React, { useEffect } from "react";
import {
  Zap,
  CheckCircle2,
  Target,
  Bug,
  Clock,
  Check,
} from "lucide-react";
import { useNavStore } from "@/store/useNavStore";
import { fetchUserProgress, type Quest } from "@/services/progressApi";

const DEFAULT_QUESTS: Quest[] = [
  {
    id: "earn_xp",
    title: "Earn 30 XP today",
    current: 0,
    target: 30,
    reward_bytes: 10,
    claimed: false,
  },
  {
    id: "complete_nodes",
    title: "Finish 2 lesson nodes",
    current: 0,
    target: 2,
    reward_bytes: 15,
    claimed: false,
  },
  {
    id: "clean_accuracy",
    title: "Score 80% or higher in a lesson",
    current: 0,
    target: 1,
    reward_bytes: 20,
    claimed: false,
  },
];

const VALID_IDS = new Set([
  "earn_xp",
  "complete_nodes",
  "clean_accuracy",
  "hunt_bugs",
]);

export function DailyQuestsWidget({ className = "" }: { className?: string }) {
  const dailyQuests = useNavStore((state) => state.dailyQuests);
  const syncNav = useNavStore((state) => state.syncNav);

  useEffect(() => {
    const needsSync =
      !dailyQuests ||
      dailyQuests.length === 0 ||
      dailyQuests.some((q) => !VALID_IDS.has(q.id));
    if (needsSync) {
      fetchUserProgress()
        .then((prog) => {
          syncNav(prog);
        })
        .catch(() => {});
    }
  }, [dailyQuests, syncNav]);

  const hasValidQuests =
    Array.isArray(dailyQuests) &&
    dailyQuests.length > 0 &&
    dailyQuests.every((q) => VALID_IDS.has(q.id));

  const quests: Quest[] = hasValidQuests ? dailyQuests : DEFAULT_QUESTS;

  const renderLeadingIcon = (questId: string) => {
    if (questId === "earn_xp") {
      return (
        <div className="w-10 h-10 flex items-center justify-center shrink-0 text-amber-400">
          <Zap className="w-7 h-7" strokeWidth={2} />
        </div>
      );
    }

    if (questId === "complete_nodes") {
      return (
        <div className="w-10 h-10 flex items-center justify-center shrink-0 text-sky-400">
          <CheckCircle2 className="w-7 h-7" strokeWidth={2} />
        </div>
      );
    }

    if (questId === "hunt_bugs") {
      return (
        <div className="w-10 h-10 flex items-center justify-center shrink-0 text-purple-400">
          <Bug className="w-7 h-7" strokeWidth={2} />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 flex items-center justify-center shrink-0 text-emerald-400">
        <Target className="w-7 h-7" strokeWidth={2} />
      </div>
    );
  };

  return (
    <div
      className={`rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 p-6 sm:p-7 shadow-2xl flex flex-col gap-6 select-none relative ${className}`}
    >
      <div className="flex items-center justify-between gap-2 pb-1">
        <h3 className="text-white font-black text-xl tracking-tight">
          Daily Quests
        </h3>
        <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-400 inline-flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" strokeWidth={2} />
          <span>Resets daily</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {quests.map((quest) => {
          const isCompleted = Boolean(
            quest.claimed || quest.current >= quest.target
          );
          const percent = Math.min(
            100,
            Math.max(0, Math.round((quest.current / Math.max(1, quest.target)) * 100))
          );

          return (
            <div key={quest.id} className="flex items-center gap-3.5">
              {renderLeadingIcon(quest.id)}

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <span
                  className={`font-black text-sm sm:text-base break-words leading-snug ${
                    isCompleted ? "text-emerald-300" : "text-slate-100"
                  }`}
                >
                  {quest.title}
                </span>

                <div className="relative w-full h-5 sm:h-6 rounded-full bg-slate-700/60 overflow-hidden flex items-center shadow-inner">
                  <div
                    className={`h-full shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] rounded-full transition-all duration-500 ease-out ${
                      isCompleted ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className={`text-xs sm:text-sm font-black tracking-tight ${
                        percent >= 55
                          ? "text-slate-950 font-black"
                          : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      }`}
                    >
                      {quest.current} / {quest.target}
                    </span>
                  </div>
                </div>
              </div>

              {isCompleted ? (
                <div className="relative shrink-0 flex items-center justify-center w-14 h-14">
                  <img
                    src="/icons/chest-gold.png"
                    alt="Claimed Chest"
                    className="w-12 h-12 object-contain"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full border-2 border-slate-900 shadow">
                    <Check className="w-3.5 h-3.5 text-slate-950" strokeWidth={3.5} />
                  </div>
                </div>
              ) : (
                <div className="relative shrink-0 flex items-center justify-center w-14 h-14">
                  <img
                    src="/icons/chest-closed.png"
                    alt="Locked Chest"
                    className="w-12 h-12 object-contain opacity-85"
                  />
                  <div className="absolute -top-1.5 -right-1 bg-slate-800 text-slate-300 text-[11px] font-black px-2 py-0.5 rounded-full border border-slate-700 shadow-sm">
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
