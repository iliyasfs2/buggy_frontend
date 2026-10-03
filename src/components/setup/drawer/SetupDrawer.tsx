"use client";

import type { ReactElement } from "react";
import { useSetupStore } from "@/store/useSetupStore";
import { GearInventory } from "./GearInventory";
import { SystemSpecs } from "./SystemSpecs";
import { Boxes, Cpu } from "lucide-react";

export function SetupDrawer(): ReactElement {
  const activeDrawerTab = useSetupStore((state) => state.activeDrawerTab);
  const setActiveDrawerTab = useSetupStore((state) => state.setActiveDrawerTab);

  return (
    <div className="w-full flex flex-col rounded-2xl bg-[#101826] border-2 border-slate-700/80 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between border-b-2 border-slate-700/80 bg-slate-900/90 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDrawerTab("gear")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeDrawerTab === "gear"
                ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Gear &amp; Decor</span>
          </button>

          <button
            onClick={() => setActiveDrawerTab("specs")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeDrawerTab === "specs"
                ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>System Specs</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
          CUSTOMIZE WORKSPACE
        </div>
      </div>

      <div className="p-4 sm:p-5 bg-[#101826]">
        {activeDrawerTab === "gear" ? <GearInventory /> : <SystemSpecs />}
      </div>
    </div>
  );
}
