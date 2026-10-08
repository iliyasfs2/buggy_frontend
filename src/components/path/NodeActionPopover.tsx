"use client";

import type { ReactElement } from "react";
import type { PathNode } from "@/types/roadmap";
import type { NodePalette } from "./LessonNode";
import { Lock, Play } from "lucide-react";

export interface NodeActionPopoverProps {
  node: PathNode;
  palette?: NodePalette;
  onClose: () => void;
  onStartNode?: (node: PathNode) => void;
}

export function NodeActionPopover({
  node,
  palette,
  onStartNode
}: NodeActionPopoverProps): ReactElement {
  const isCompleted = node.status === "completed";
  const isLocked = node.status === "locked";

  const primaryColor = isLocked
    ? "oklch(37.2% 0.044 257.287)"
    : palette?.primary || "oklch(79.5% 0.184 86.047)";

  const borderColor = isLocked
    ? "oklch(28.5% 0.04 257.287)"
    : palette?.sideWall || "oklch(67.5% 0.19 86.047)";

  const isDarkCard = isLocked || (palette?.primary.includes("138") || palette?.primary.includes("225") || palette?.primary.includes("300"));
  const textColor = isDarkCard ? "#ffffff" : "#0f172a";

  const buttonText = isLocked
    ? "LOCKED"
    : isCompleted
    ? `PRACTICE +${node.xpReward || 10} XP`
    : `START +${node.xpReward || 10} XP`;

  return (
    <div
      className="node-popover-breathing absolute top-full left-1/2 mt-3 z-50 w-[280px] max-w-[calc(100vw-32px)] rounded-2xl border-2 shadow-[0_12px_28px_rgba(0,0,0,0.35)] p-4 flex flex-col gap-3 select-none"
      style={{
        backgroundColor: primaryColor,
        borderColor: borderColor,
        color: textColor
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px]"
        style={{ borderBottomColor: primaryColor }}
      />
      <div
        className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[9px] -z-10"
        style={{ borderBottomColor: borderColor }}
      />

      <div className="flex flex-col items-center text-center px-1">
        <h4 className="text-base sm:text-lg font-black tracking-tight leading-snug">
          {node.title}
        </h4>
      </div>

      <div className="w-full">
        {isLocked ? (
          <div className="w-full py-3 px-4 rounded-xl bg-slate-800/90 border-b-4 border-slate-950 text-slate-400 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed">
            <Lock className="w-4 h-4" />
            <span>{buttonText}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onStartNode?.(node)}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 border-b-4 border-slate-950 hover:bg-slate-700 active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{buttonText}</span>
          </button>
        )}
      </div>

      <style>{`
        @keyframes popoverBreathing {
          0%, 100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, -4px);
          }
        }

        .node-popover-breathing {
          animation: popoverBreathing 2.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default NodeActionPopover;
