"use client";

import type { ReactElement } from "react";
import { MOCK_DAILY_QUESTS } from "@/constants/roadmap";
import { Sparkles } from "lucide-react";

export function PathSidebar(): ReactElement {
  return (
    <aside aria-label="Roadmap Quests and Stats" className="w-full flex flex-col gap-6 select-none">
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
    </aside>
  );
}
