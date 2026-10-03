"use client";

import type { ReactElement } from "react";
import { SetupStage } from "./stage/SetupStage";
import { SetupDrawer } from "./drawer/SetupDrawer";

export function SetupView(): ReactElement {
  return (
    <div className="w-full min-h-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-100">
              Workspace Setup
            </span>
            <span className="text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
              v2.0 Sandbox
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalize your developer battlestation and inspect telemetry in real-time.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <SetupStage />
        <SetupDrawer />
      </div>
    </div>
  );
}
