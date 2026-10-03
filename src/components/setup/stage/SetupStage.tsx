"use client";

import type { ReactElement } from "react";
import { RoomLayer } from "./layers/RoomLayer";
import { DeskLayer } from "./layers/DeskLayer";
import { AvatarLayer } from "./layers/AvatarLayer";
import { CompanionLayer } from "./layers/CompanionLayer";
import { useSetupStore } from "@/store/useSetupStore";
import { useSetupInteractions } from "../hooks/useSetupInteractions";
import { Camera, Sparkles, Check, Share2 } from "lucide-react";

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
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 to-[#0c121e] border-2 border-slate-700/80 shadow-2xl overflow-hidden aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] max-h-[480px]">
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-full px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[11px] font-mono tracking-tight text-slate-200">Dev Sanctum v2</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-emerald-950/70 border border-emerald-500/40 rounded-full px-2 py-0.5 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          60 FPS LIVE
        </div>
      </div>

      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <button
          onClick={triggerSnapshot}
          className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700/90 active:scale-95 border border-slate-600 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-200 backdrop-blur-md shadow-md transition-all cursor-pointer"
          title="Export Setup Snapshot"
        >
          <Camera className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline font-mono text-[11px]">Snapshot</span>
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
            className="absolute bottom-16 right-16 sm:right-28 animate-float-particle font-mono text-sm sm:text-base font-bold select-none text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
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
