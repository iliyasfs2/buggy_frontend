"use client";

import React, { useEffect } from "react";
import {
  Zap,
  CheckCircle2,
  Target,
  Bug,
  Gift,
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
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </div>
      );
    }

    if (questId === "complete_nodes") {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0 text-sky-400">
          <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </div>
      );
    }

    if (questId === "hunt_bugs") {
      return (
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 text-purple-400">
          <Bug className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
        </div>
      );
    }

    return (
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
        <Target className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
      </div>
    );
  };

  return (
    <div
      className={`rounded-2xl bg-[#131f24] border-2 border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col gap-5 select-none relative ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-white font-black text-lg sm:text-xl tracking-tight">
          Daily Quests
        </h3>
        <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-bold text-slate-400 inline-flex items-center gap-1.5 shrink-0">
          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" strokeWidth={2} />
          <span>Resets daily</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
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
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`font-black text-xs sm:text-sm break-words leading-snug ${
                      isCompleted ? "text-emerald-300" : "text-white"
                    }`}
                  >
                    {quest.title}
                  </span>
                  <span
                    className={`text-xs font-black font-mono shrink-0 ${
                      isCompleted ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {quest.current} / {quest.target}
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isCompleted ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              <div
                className={`relative shrink-0 w-12 h-11 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isCompleted
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-slate-900/90 border-slate-800 text-slate-400"
                }`}
              >
                <Gift className="w-4 h-4 shrink-0" strokeWidth={2} />
                <span className="text-[10px] font-black leading-none">
                  +{quest.reward_bytes}
                </span>

                {isCompleted && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center border border-[#131f24] shadow">
                    <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
