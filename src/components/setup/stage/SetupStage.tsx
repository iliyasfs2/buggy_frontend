"use client";

import type { ReactElement } from "react";
import { RoomLayer } from "./layers/RoomLayer";
import { DeskLayer } from "./layers/DeskLayer";
import { AvatarLayer } from "./layers/AvatarLayer";
import { CompanionLayer } from "./layers/CompanionLayer";
import { useSetupStore } from "@/store/useSetupStore";
import { useSetupInteractions } from "../hooks/useSetupInteractions";
import { Camera, Check } from "lucide-react";

export function SetupStage(): ReactElement {
  const equipped = useSetupStore((state) => state.equipped);
  const {
    isBuggyHopping,
    isBuggyHappy,
    isMugSipping,
    isScreenFlickering,
    floatingParticles,
    snapshotToast,
    handleBuggyClick,
    handleMugClick,
    handleScreenClick,
    triggerSnapshot
  } = useSetupInteractions();

  return (
    <div className="relative w-full aspect-[16/9] min-h-[420px] sm:min-h-[460px] rounded-3xl border border-slate-700/60 bg-[#0f172a] shadow-2xl overflow-hidden select-none">
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button
          onClick={triggerSnapshot}
          className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 border border-slate-600/80 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md shadow-md transition-all cursor-pointer"
          title="Export Setup Snapshot"
        >
          <Camera className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-mono text-[11px]">Snapshot</span>
        </button>
      </div>

      {snapshotToast && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 bg-emerald-900/95 border border-emerald-400 text-emerald-100 text-xs font-medium px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5 text-emerald-300" />
          <span>{snapshotToast}</span>
        </div>
      )}

      <RoomLayer wallArt={equipped.wallArt} />
      <DeskLayer
        monitor={equipped.monitor}
        keyboard={equipped.keyboard}
        drink={equipped.drink}
        isMugSipping={isMugSipping}
        isScreenFlickering={isScreenFlickering}
        onScreenClick={handleScreenClick}
        onMugClick={handleMugClick}
      />
      <AvatarLayer />
      <CompanionLayer
        buggyHat={equipped.buggyHat}
        isHopping={isBuggyHopping}
        isHappy={isBuggyHappy}
        onBuggyClick={handleBuggyClick}
      />

      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingParticles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bottom-[28%] right-[18%] animate-float-particle font-mono text-base font-bold select-none text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
            style={{
              transform: `translate3d(${particle.x}px, ${particle.y}px, 0)`
            }}
          >
            {particle.symbol}
          </div>
        ))}
      </div>
    </div>
  );
}
