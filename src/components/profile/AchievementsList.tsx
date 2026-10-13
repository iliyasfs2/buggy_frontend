"use client";

import React from "react";
import {
  useNavStore,
  selectStreakCount,
  selectTotalXP,
  selectByteBalance,
  selectCompletedNodesCount,
} from "@/store/useNavStore";

export function AchievementsList() {
  const streak = useNavStore(selectStreakCount);
  const totalXP = useNavStore(selectTotalXP);
  const byteBalance = useNavStore(selectByteBalance);
  const completedNodesCount = useNavStore(selectCompletedNodesCount);

  const achievements = [
    {
      id: "ach-1",
      title: "First Step",
      desc: "Complete your very first lesson node",
      current: completedNodesCount,
      target: 1,
      reward: 10,
      tier: "BRONZE",
      badgeColor: "from-amber-600 to-amber-800",
      iconSvg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-300">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      id: "ach-2",
      title: "Code Cadet",
      desc: "Complete 5 lesson nodes in JavaScript roadmap",
      current: completedNodesCount,
      target: 5,
      reward: 35,
      tier: "SILVER",
      badgeColor: "from-sky-400 to-blue-600",
      iconSvg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-sky-200">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: "ach-3",
      title: "Streak Pioneer",
      desc: "Keep your daily learning streak alive for 3 days",
      current: streak,
      target: 3,
      reward: 50,
      tier: "GOLD",
      badgeColor: "from-orange-500 to-amber-500",
      iconSvg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-200">
          <path d="M12 2c0 0-6 7.5-6 12.5a6 6 0 0 0 12 0C18 9.5 12 2 12 2z" />
        </svg>
      ),
    },
    {
      id: "ach-4",
      title: "XP Powerhouse",
      desc: "Accumulate 50 total Experience Points (XP)",
      current: totalXP,
      target: 50,
      reward: 40,
      tier: "GOLD",
      badgeColor: "from-purple-500 to-indigo-600",
      iconSvg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-purple-200">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
    },
    {
      id: "ach-5",
      title: "Byte Hoarder",
      desc: "Collect and hold 150 Byte Coins in your wallet",
      current: byteBalance,
      target: 150,
      reward: 60,
      tier: "DIAMOND",
      badgeColor: "from-cyan-400 to-emerald-500",
      iconSvg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-cyan-200">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M9 9h6" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  const unlockedCount = achievements.filter((a) => a.current >= a.target).length;

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
            Achievements & Badges
          </h3>
          <p className="text-[11px] font-bold text-slate-400">Unlock game milestones</p>
        </div>
        <span className="text-[11px] font-black px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-mono">
          {unlockedCount} / {achievements.length} Unlocked
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {achievements.map((ach) => {
          const isUnlocked = ach.current >= ach.target;
          const percent = Math.min(100, Math.round((ach.current / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`flex items-center gap-4 p-4 rounded-3xl border-2 transition-all ${
                isUnlocked
                  ? "bg-slate-900/90 border-amber-500/30 shadow-[0_4px_20px_-6px_rgba(245,158,11,0.2)]"
                  : "bg-slate-950/60 border-slate-800/80"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isUnlocked
                    ? `bg-gradient-to-tr ${ach.badgeColor} border border-white/20`
                    : "bg-slate-800/80 border border-slate-700/60 opacity-60"
                }`}
              >
                {ach.iconSvg}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm font-black text-white truncate">
                      {ach.title}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isUnlocked
                          ? "bg-amber-400/15 text-amber-400 border border-amber-400/30"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {ach.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[11px] font-black">
                    <span>+{ach.reward}</span>
                    <img src="/icons/byte.png" alt="Byte" className="w-3.5 h-3.5 object-contain" />
                  </div>
                </div>

                <p className="text-[11px] font-medium text-slate-400 truncate">
                  {ach.desc}
                </p>

                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50 p-0.5 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked
                          ? "bg-gradient-to-r from-amber-400 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                          : "bg-gradient-to-r from-sky-500 to-cyan-400"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] font-black text-slate-300 shrink-0">
                    {Math.min(ach.current, ach.target)} / {ach.target}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
