"use client";

import type { ReactElement } from "react";
import { MOCK_DAILY_QUESTS, MOCK_LEADERBOARD_RANKS } from "@/constants/roadmap";
import { Sparkles, Trophy, Flame, ChevronRight, Award } from "lucide-react";
import Image from "next/image";

export interface PathSidebarProps {
  currentTrack?: string;
}

export function PathSidebar({ currentTrack = "JavaScript & React" }: PathSidebarProps): ReactElement {
  return (
    <aside aria-label="Roadmap Quests and Stats" className="w-full flex flex-col gap-6 select-none">
      <div className="rounded-2xl bg-slate-900/90 border-2 border-slate-800 p-5 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center font-black text-yellow-400 font-mono text-xl shadow">
            JS
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
              Active Track
            </span>
            <h4 className="text-sm font-black text-slate-100">
              {currentTrack}
            </h4>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-emerald-400">28% Complete</span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div className="w-[28%] h-full bg-emerald-400 rounded-full" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/90 border-2 border-slate-800 p-5 shadow-xl flex items-center gap-4 relative overflow-hidden">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center">
            <Image
              src="/icons/streak.png"
              alt="Streak"
              width={28}
              height={28}
              className="w-7 h-7 object-contain"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>14 Day Streak!</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-tight">
            Complete a lesson today to keep your streak shield intact.
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/90 border-2 border-slate-800 p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-black text-slate-100 tracking-tight">
              Daily Quests
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">1/3 Done</span>
        </div>

        <div className="flex flex-col gap-3.5">
          {MOCK_DAILY_QUESTS.map((quest) => {
            const percent = Math.min(100, Math.round((quest.current / quest.total) * 100));
            return (
              <div key={quest.id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${quest.completed ? "text-slate-400 line-through" : "text-slate-200"}`}>
                    {quest.title}
                  </span>
                  <span className="font-mono text-[11px] text-amber-400 font-bold shrink-0 ml-2">
                    +{quest.xpReward} XP
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      quest.completed ? "bg-emerald-400" : "bg-sky-400"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/90 border-2 border-slate-800 p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-black text-slate-100 tracking-tight">
              Diamond League
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Top 5</span>
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_LEADERBOARD_RANKS.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center justify-between p-2 rounded-xl transition-colors ${
                user.isCurrentUser
                  ? "bg-sky-950/60 border border-sky-500/40"
                  : "hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-mono text-xs font-bold text-slate-400">
                  {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : `#${user.rank}`}
                </span>
                <div className={`w-7 h-7 rounded-full ${user.avatarColor} flex items-center justify-center text-[10px] font-bold text-slate-950 shadow`}>
                  {user.name.charAt(0)}
                </div>
                <span className={`text-xs font-semibold ${user.isCurrentUser ? "text-sky-300 font-bold" : "text-slate-200"}`}>
                  {user.name}
                </span>
              </div>
              <span className="font-mono text-xs text-slate-400 font-semibold">
                {user.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
