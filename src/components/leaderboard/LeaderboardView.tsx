"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore, selectTotalXP, selectStreakCount } from "@/store/useGameStore";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import type { AvatarConfig } from "@/services/authApi";

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
  avatarConfig?: AvatarConfig;
}

export function LeaderboardView() {
  const { user } = useAuthStore();
  const totalXP = useGameStore(selectTotalXP);
  const streakCount = useGameStore(selectStreakCount);

  const [activeTab, setActiveTab] = useState<"weekly" | "all_time">("weekly");

  const currentUserName = user?.username || "You";
  const currentUserXp = totalXP || 240;
  const currentUserStreak = streakCount || 2;

  const mockUsers: LeaderboardUser[] = [
    {
      rank: 1,
      id: "u1",
      name: "Alex Rivera",
      xp: 840,
      streak: 14,
    },
    {
      rank: 2,
      id: "u2",
      name: "Sarah Chen",
      xp: 720,
      streak: 9,
    },
    {
      rank: 3,
      id: "u3",
      name: "Marcus Vance",
      xp: 610,
      streak: 12,
    },
    {
      rank: 4,
      id: "current",
      name: currentUserName,
      xp: currentUserXp,
      streak: currentUserStreak,
      isCurrentUser: true,
      avatarConfig: user?.avatar_config || user?.avatar,
    },
    {
      rank: 5,
      id: "u4",
      name: "Elena Rostova",
      xp: 190,
      streak: 4,
    },
    {
      rank: 6,
      id: "u5",
      name: "David Kim",
      xp: 150,
      streak: 3,
    },
    {
      rank: 7,
      id: "u6",
      name: "Maya Patel",
      xp: 110,
      streak: 2,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8 pb-28 md:pb-12 select-none">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative w-28 h-20 flex items-center justify-center">
          <Image
            src="/icons/leaderboard.png"
            alt="Leaderboard Podium"
            width={112}
            height={80}
            className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
            priority
          />
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Ruby League
        </h1>
        <p className="text-sm font-bold text-slate-400 max-w-md">
          Top 3 coders earn promotion to the Obsidian League at the end of the week!
        </p>

        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 mt-2">
          <button
            type="button"
            onClick={() => setActiveTab("weekly")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "weekly"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Weekly
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all_time")}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "all_time"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {mockUsers.map((item) => {
          const isTop3 = item.rank <= 3;
          const isFirst = item.rank === 1;
          const isSecond = item.rank === 2;
          const isThird = item.rank === 3;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between px-5 py-3.5 rounded-2xl border-2 transition-all ${
                item.isCurrentUser
                  ? "bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-400/40"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700/80"
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-8 flex items-center justify-center shrink-0">
                  {isFirst && (
                    <span className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500 flex items-center justify-center font-black text-sm">
                      1
                    </span>
                  )}
                  {isSecond && (
                    <span className="w-7 h-7 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400 flex items-center justify-center font-black text-sm">
                      2
                    </span>
                  )}
                  {isThird && (
                    <span className="w-7 h-7 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700 flex items-center justify-center font-black text-sm">
                      3
                    </span>
                  )}
                  {!isTop3 && (
                    <span className="font-mono font-bold text-slate-500 text-sm">
                      {item.rank}
                    </span>
                  )}
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.avatarConfig ? (
                    <AvatarRenderer config={item.avatarConfig} size={40} />
                  ) : (
                    <span className="font-black text-slate-400 text-sm">
                      {item.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black text-sm truncate ${
                        item.isCurrentUser ? "text-blue-300" : "text-slate-200"
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.isCurrentUser && (
                      <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-500 text-slate-950">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1 text-orange-400/90 font-mono">
                      <Flame className="w-3 h-3 fill-orange-400" />
                      {item.streak}d
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono font-black text-base text-slate-200">
                  {item.xp} <span className="text-xs text-slate-500">XP</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
