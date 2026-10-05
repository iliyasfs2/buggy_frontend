"use client";

import type { ReactElement } from "react";
import type { PathNode } from "@/types/roadmap";
import { Check, Lock, Star, Zap, Crown } from "lucide-react";

export interface PathNodeButtonProps {
  node: PathNode;
  index: number;
  onSelectNode: (node: PathNode) => void;
  isSelected?: boolean;
}

const WINDING_OFFSETS = [0, -45, -70, -45, 0, 45, 70, 45];

export function PathNodeButton({
  node,
  index,
  onSelectNode,
  isSelected = false
}: PathNodeButtonProps): ReactElement {
  const horizontalOffset = WINDING_OFFSETS[index % WINDING_OFFSETS.length];
  const isBoss = node.type === "boss_challenge";
  const isCurrent = node.status === "current";
  const isCompleted = node.status === "completed";
  const isLocked = node.status === "locked";

  const getNodeStyles = (): string => {
    if (isCompleted) {
      return "bg-emerald-500 border-emerald-700 text-slate-950 shadow-emerald-950/40 hover:brightness-110";
    }
    if (isCurrent) {
      return "bg-sky-500 border-sky-700 text-slate-950 ring-4 ring-sky-400/50 shadow-sky-950/40 hover:brightness-110";
    }
    return "bg-slate-800 border-slate-950 text-slate-500 cursor-not-allowed opacity-80";
  };

  const renderIcon = (): ReactElement => {
    if (isLocked) {
      if (isBoss) {
        return <Crown className="w-8 h-8 stroke-[2.5]" />;
      }
      return <Lock className="w-6 h-6 stroke-[2.5]" />;
    }

    if (isCompleted) {
      if (isBoss) {
        return <Crown className="w-8 h-8 stroke-[2.5] fill-amber-300 text-slate-950" />;
      }
      return <Check className="w-7 h-7 stroke-[3.5]" />;
    }

    if (isBoss) {
      return <Crown className="w-8 h-8 stroke-[2.5] fill-amber-300 text-slate-950" />;
    }

    if (node.type === "quiz") {
      return <Zap className="w-7 h-7 stroke-[2.5] fill-yellow-300 text-slate-950" />;
    }

    return <Star className="w-7 h-7 stroke-[2.5] fill-amber-300 text-slate-950" />;
  };

  return (
    <div
      className="relative flex flex-col items-center py-4 select-none"
      style={{
        transform: `translate3d(${horizontalOffset}px, 0, 0)`
      }}
    >
      {isCurrent && (
        <div className="absolute -top-7 z-20 animate-bounce pointer-events-none">
          <div className="relative bg-sky-500 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-xl shadow-lg flex items-center justify-center">
            <span>START</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-sky-500 rotate-45 rounded-[2px]" />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => onSelectNode(node)}
        aria-label={`${node.title} - ${node.type} (${node.status})`}
        className={`relative flex items-center justify-center rounded-full transition-all cursor-pointer ${
          isBoss
            ? "w-20 h-20 sm:w-22 sm:h-22 border-b-[8px] active:border-b-2 active:translate-y-1.5"
            : "w-16 h-16 sm:w-18 sm:h-18 border-b-[6px] active:border-b-2 active:translate-y-1"
        } ${getNodeStyles()} ${
          isSelected ? "scale-110 ring-4 ring-yellow-400" : ""
        }`}
      >
        <div className="flex items-center justify-center">
          {renderIcon()}
        </div>
      </button>

      <div className="mt-2 text-center max-w-[120px] pointer-events-none">
        <span
          className={`text-xs font-bold leading-tight line-clamp-1 block ${
            isCurrent
              ? "text-sky-300 font-extrabold"
              : isCompleted
              ? "text-slate-200"
              : "text-slate-500"
          }`}
        >
          {node.title}
        </span>
      </div>
    </div>
  );
}
