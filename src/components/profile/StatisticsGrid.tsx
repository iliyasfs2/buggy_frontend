"use client";

import React from "react";
import {
  useNavStore,
  selectStreakCount,
  selectTotalXP,
  selectByteBalance,
  selectCompletedNodesCount,
} from "@/store/useNavStore";

export function StatisticsGrid() {
  const streak = useNavStore(selectStreakCount);
  const totalXP = useNavStore(selectTotalXP);
  const byteBalance = useNavStore(selectByteBalance);
  const completedNodesCount = useNavStore(selectCompletedNodesCount);

  const stats = [
    {
      id: "streak",
      title: "Current Streak",
      value: `${streak} Days`,
      sub: "Active daily run",
      iconSrc: "/icons/streak.png",
      glowColor: "rgba(249,115,22,0.25)",
      borderColor: "border-orange-500/30",
      accentBg: "bg-orange-500/10",
      textColor: "text-orange-400",
    },
    {
      id: "xp",
      title: "Total XP",
      value: `${totalXP} XP`,
      sub: "Experience points",
      isSvg: true,
      glowColor: "rgba(168,85,247,0.25)",
      borderColor: "border-purple-500/30",
      accentBg: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
    {
      id: "bytes",
      title: "Byte Coins",
      value: `${byteBalance} Bytes`,
      sub: "Reward balance",
      iconSrc: "/icons/byte.png",
      glowColor: "rgba(245,158,11,0.25)",
      borderColor: "border-amber-500/30",
      accentBg: "bg-amber-500/10",
      textColor: "text-amber-400",
    },
    {
      id: "nodes",
      title: "Completed Lessons",
      value: `${completedNodesCount} Passed`,
      sub: "Mastered nodes",
      iconSrc: "/icons/js-badge.png",
      glowColor: "rgba(16,185,129,0.25)",
      borderColor: "border-emerald-500/30",
      accentBg: "bg-emerald-500/10",
      textColor: "text-emerald-400",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
          Statistics
        </h3>
        <span className="text-[11px] font-bold text-slate-400">All-time record</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`relative p-4 sm:p-5 rounded-3xl bg-slate-900/90 border-2 ${stat.borderColor} shadow-xl flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform`}
            style={{
              boxShadow: `0 10px 25px -10px ${stat.glowColor}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 truncate">
                {stat.title}
              </span>
              <div
                className={`w-10 h-10 rounded-2xl ${stat.accentBg} flex items-center justify-center shrink-0 border ${stat.borderColor}`}
              >
                {stat.isSvg ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ) : (
                  <img
                    src={stat.iconSrc}
                    alt={stat.title}
                    className="w-6 h-6 object-contain drop-shadow"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <span className={`text-xl sm:text-2xl font-black ${stat.textColor} tracking-tight leading-none`}>
                {stat.value}
              </span>
              <span className="text-[11px] font-bold text-slate-400 mt-1">
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
