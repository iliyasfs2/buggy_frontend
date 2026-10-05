"use client";

import type { ReactElement } from "react";
import type { PathNode } from "@/types/roadmap";
import { X, Sparkles, Trophy, Star, Zap, Lock, ArrowRight } from "lucide-react";

export interface NodeActionModalProps {
  node: PathNode | null;
  onClose: () => void;
  onStartNode?: (node: PathNode) => void;
}

export function NodeActionModal({
  node,
  onClose,
  onStartNode
}: NodeActionModalProps): ReactElement | null {
  if (!node) return null;

  const isCompleted = node.status === "completed";
  const isCurrent = node.status === "current";
  const isLocked = node.status === "locked";
  const isBoss = node.type === "boss_challenge";

  const getNodeTypeBadge = (): ReactElement => {
    if (isBoss) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          Boss Battle
        </span>
      );
    }
    if (node.type === "quiz") {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          Quiz Checkpoint
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider">
        <Star className="w-3.5 h-3.5" />
        Lesson
      </span>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={node.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#1e293b] border-2 border-slate-700 shadow-2xl p-6 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-2">{getNodeTypeBadge()}</div>

        <div className="flex flex-col items-center">
          <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            {node.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {node.totalSteps} interactive steps to complete
          </p>
        </div>

        <div className="w-full grid grid-cols-2 gap-3 bg-slate-900/80 rounded-2xl p-3 border border-slate-800">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[11px] font-mono text-slate-400 uppercase">XP Reward</span>
            <div className="flex items-center gap-1 text-base font-black text-amber-400 font-mono mt-0.5">
              <Sparkles className="w-4 h-4" />
              <span>+{node.xpReward} XP</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-l border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Status</span>
            <span
              className={`text-xs font-bold uppercase mt-0.5 ${
                isCompleted
                  ? "text-emerald-400"
                  : isCurrent
                  ? "text-sky-400"
                  : "text-slate-500"
              }`}
            >
              {node.status}
            </span>
          </div>
        </div>

        <div className="w-full pt-2">
          {isLocked ? (
            <div className="w-full py-3.5 px-4 rounded-2xl bg-slate-800/80 border-b-4 border-slate-900 text-slate-400 text-sm font-bold flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Complete previous lessons to unlock</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onStartNode?.(node)}
              className={`w-full py-3.5 px-4 rounded-2xl border-b-[6px] active:border-b-2 active:translate-y-1 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                isCompleted
                  ? "bg-emerald-400 border-emerald-600 hover:bg-emerald-300"
                  : "bg-sky-400 border-sky-600 hover:bg-sky-300"
              }`}
            >
              <span>{isCompleted ? "Practice Again" : "Start Lesson"}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
