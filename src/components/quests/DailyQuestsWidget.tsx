"use client";

import React, { useEffect } from "react";
import {
  Zap,
  CheckCircle2,
  Target,
  Bug,
  ShieldCheck,
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
    title: "Score 80%+ in a lesson",
    current: 0,
    target: 1,
    reward_bytes: 20,
    claimed: false,
  },
];

const SHORT_TITLES: Record<string, string> = {
  earn_xp: "Earn 30 XP today",
  complete_nodes: "Finish 2 lesson nodes",
  clean_accuracy: "Score 80%+ in a lesson",
  hunt_bugs: "Fix 3 bugs in Debug Lab",
  perfect_node: "Finish 1 node with 0 mistakes",
};

const VALID_IDS = new Set(Object.keys(SHORT_TITLES));

export function DailyQuestsWidget({ className = "" }: { className?: string }) {
  const dailyQuests = useNavStore((state) => state.dailyQuests);
  const syncNav = useNavStore((state) => state.syncNav);

  useEffect(() => {
    const needsSync =
      !dailyQuests ||
      dailyQuests.length === 0 ||
      dailyQuests.some(
        (q) => !VALID_IDS.has(q.id) || q.title !== SHORT_TITLES[q.id]
      );
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

  const quests: Quest[] = (hasValidQuests ? dailyQuests : DEFAULT_QUESTS).map(
    (q) => ({
      ...q,
      title: SHORT_TITLES[q.id] || q.title,
    })
  );

  const renderLeadingIcon = (questId: string) => {
    if (questId === "earn_xp") {
      return (
        <div className="w-9 h-9 flex items-center justify-center shrink-0 text-amber-400">
          <Zap className="w-6 h-6" strokeWidth={2} />
        </div>
      );
    }

    if (questId === "complete_nodes") {
      return (
        <div className="w-9 h-9 flex items-center justify-center shrink-0 text-sky-400">
          <CheckCircle2 className="w-6 h-6" strokeWidth={2} />
        </div>
      );
    }

    if (questId === "hunt_bugs") {
      return (
        <div className="w-9 h-9 flex items-center justify-center shrink-0 text-purple-400">
          <Bug className="w-6 h-6" strokeWidth={2} />
        </div>
      );
    }

    if (questId === "perfect_node") {
      return (
        <div className="w-9 h-9 flex items-center justify-center shrink-0 text-cyan-400">
          <ShieldCheck className="w-6 h-6" strokeWidth={2} />
        </div>
      );
    }

    return (
      <div className="w-9 h-9 flex items-center justify-center shrink-0 text-emerald-400">
        <Target className="w-6 h-6" strokeWidth={2} />
      </div>
    );
  };

  return (
    <div
      className={`rounded-3xl bg-slate-900/90 border-2 border-b-4 border-slate-800 border-b-slate-950/90 p-5 sm:p-6 shadow-2xl flex flex-col gap-5 select-none relative ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-white font-black text-lg sm:text-xl tracking-tight whitespace-nowrap">
          Daily Quests
        </h3>
        <div className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-slate-400 inline-flex items-center gap-1.5 shrink-0">
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
            <div key={quest.id} className="flex items-center gap-3">
              {renderLeadingIcon(quest.id)}

              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <span
                  className={`font-bold text-sm truncate whitespace-nowrap leading-tight ${
                    isCompleted ? "text-emerald-300" : "text-slate-100"
                  }`}
                >
                  {quest.title}
                </span>

                <div className="relative w-full h-5 rounded-full bg-slate-700/60 overflow-hidden flex items-center shadow-inner">
                  <div
                    className={`h-full shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)] rounded-full transition-all duration-500 ease-out ${
                      isCompleted ? "bg-emerald-500" : "bg-amber-400"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                      className={`text-xs font-black tracking-tight ${
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
                <div className="relative shrink-0 flex flex-col items-center justify-center gap-0.5 w-12">
                  <div className="relative flex items-center justify-center">
                    <img
                      src="/icons/chest-gold.png"
                      alt="Claimed Chest"
                      className="w-10 h-10 object-contain brightness-110 drop-shadow-[0_2px_8px_rgba(250,204,21,0.35)]"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-slate-950 p-0.5 rounded-full border-2 border-slate-900 shadow">
                      <Check className="w-2.5 h-2.5 text-slate-950" strokeWidth={3.5} />
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black leading-none">
                    +{quest.reward_bytes}
                  </span>
                </div>
              ) : (
                <div className="relative shrink-0 flex flex-col items-center justify-center gap-0.5 w-12">
                  <img
                    src="/icons/chest-closed.png"
                    alt="Reward Chest"
                    className="w-10 h-10 object-contain brightness-125 contrast-105 drop-shadow-[0_2px_6px_rgba(255,255,255,0.12)]"
                  />
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-black leading-none shadow-sm">
                    +{quest.reward_bytes}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
