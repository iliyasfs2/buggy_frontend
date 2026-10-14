"use client";

import type { ReactElement, ReactNode } from "react";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { LessonIcon, type LessonIconType } from "./LessonIcon";

export type NodeState = "locked" | "current" | "completed";

export interface NodePalette {
  primary: string;
  light: string;
  highlight: string;
  sideWall: string;
  lowerSide: string;
  bottomEdge: string;
}

export const CHAPTER_1_PALETTE: NodePalette = {
  primary: "oklch(79.5% 0.184 86.047)",
  light: "oklch(84.5% 0.16 86.047)",
  highlight: "oklch(91% 0.11 86.047)",
  sideWall: "oklch(67.5% 0.19 86.047)",
  lowerSide: "oklch(60% 0.19 86.047)",
  bottomEdge: "oklch(60% 0.19 86.047)"
};

export const LOCKED_PALETTE: NodePalette = {
  primary: "oklch(37.2% 0.044 257.287)",
  light: "oklch(42.5% 0.04 257.287)",
  highlight: "oklch(50% 0.03 257.287)",
  sideWall: "oklch(28.5% 0.04 257.287)",
  lowerSide: "oklch(24% 0.04 257.287)",
  bottomEdge: "oklch(24% 0.04 257.287)"
};

export interface LessonNodeProps {
  id?: string;
  order?: number;
  status?: NodeState;
  state?: NodeState;
  icon?: LessonIconType | ReactNode | string;
  palette?: NodePalette;
  isUnlocking?: boolean;
  isSelected?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  ariaLabel?: string;
}

function isLessonIconType(val: unknown): val is LessonIconType {
  return (
    typeof val === "string" &&
    (val === "code" ||
      val === "brain" ||
      val === "coffee" ||
      val === "puzzle" ||
      val === "crown" ||
      val === "energy_core")
  );
}

function resolveIconType(order?: number): LessonIconType {
  switch (order) {
    case 1:
      return "code";
    case 2:
      return "brain";
    case 3:
      return "coffee";
    case 4:
      return "puzzle";
    case 5:
    default:
      return "crown";
  }
}

export function LessonNode({
  id,
  order,
  status,
  state,
  icon,
  palette,
  isUnlocking = false,
  isSelected = false,
  onClick,
  className = "",
  ariaLabel
}: LessonNodeProps): ReactElement {
  const [unlockAnimating, setUnlockAnimating] = useState(isUnlocking);

  useEffect(() => {
    if (isUnlocking) {
      setUnlockAnimating(true);
      const timer = window.setTimeout(() => {
        setUnlockAnimating(false);
      }, 750);
      return () => window.clearTimeout(timer);
    }
    setUnlockAnimating(false);
  }, [isUnlocking]);

  const rawState = state || status || "locked";
  const nodeState: NodeState = unlockAnimating ? "current" : rawState;

  const isLocked = nodeState === "locked" && !unlockAnimating;
  const isCurrent = nodeState === "current";

  const renderedIcon =
    nodeState === "completed" ? (
      <Check className="w-[34px] h-[34px] stroke-[4] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-in zoom-in-75 duration-300" />
    ) : isLessonIconType(icon) ? (
      <LessonIcon type={icon} className="w-[38px] h-[38px] max-md:w-[42px] max-md:h-[42px]" />
    ) : typeof icon === "string" ? (
      <img src={icon} alt="" draggable={false} className="w-[38px] h-[38px] max-md:w-[42px] max-md:h-[42px] object-contain select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
    ) : icon ? (
      icon
    ) : (
      <LessonIcon type={resolveIconType(order)} className="w-[38px] h-[38px] max-md:w-[42px] max-md:h-[42px]" />
    );

  const label = ariaLabel || `Lesson ${order || id || ""} - ${nodeState}`;

  const customPaletteStyle =
    nodeState === "completed"
      ? ({
          "--face": "#10b981",
          "--face-light": "#34d399",
          "--highlight": "#6ee7b7",
          "--shadow": "#059669"
        } as React.CSSProperties)
      : palette && nodeState !== "locked"
      ? ({
          "--face": palette.primary,
          "--face-light": palette.light,
          "--highlight": palette.highlight,
          "--shadow": palette.sideWall
        } as React.CSSProperties)
      : undefined;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-disabled={isLocked}
        aria-label={label}
        style={customPaletteStyle}
        className={`lesson-node lesson-node--${nodeState}`}
      >
        {isCurrent && (
          <span
            className={`lesson-node__progress-ring ${
              isSelected ? "lesson-node__progress-ring--closed" : ""
            }`}
            aria-hidden="true"
          />
        )}

        <span className="lesson-node__shadow" />
        <span className="lesson-node__face">
          <span className="lesson-node__highlight" />
          <span className="lesson-node__icon">
            {renderedIcon}
          </span>
        </span>
      </button>

      <style>{`
        .lesson-node {
          --node-width: 70px;
          --node-height: 65px;
          --node-depth: 9px;

          --face: oklch(79.5% 0.184 86.047);
          --face-light: oklch(84.5% 0.16 86.047);
          --highlight: oklch(91% 0.11 86.047);
          --shadow: oklch(67.5% 0.19 86.047);

          position: relative;
          width: var(--node-width);
          height: calc(var(--node-height) + var(--node-depth));
          padding: 0;
          margin: 0;
          border: none;
          outline: none;
          background: transparent;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          transform: translateZ(0);
          transition: filter 0.2s ease;
          overflow: visible;
        }

        .lesson-node__progress-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: calc(var(--node-width) + 8px);
          height: calc(var(--node-height) + var(--node-depth) + 8px);
          border-radius: 50%;
          border: 4.5px solid var(--face);
          pointer-events: none;
          z-index: 0;
          transform: translate(-50%, -50%);
          animation: activeRingPulse 2.4s ease-in-out infinite;
          box-sizing: border-box;
          box-shadow: 0 2px 0 var(--shadow);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .lesson-node__progress-ring--closed {
          animation: none;
          transform: translate(-50%, -50%) scale(0.96);
          opacity: 0;
          pointer-events: none;
        }

        @keyframes activeRingPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(0.96);
            opacity: 0.25;
            box-shadow: 0 1.5px 0 var(--shadow);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            opacity: 0.65;
            box-shadow: 0 2.5px 0 var(--shadow);
          }
        }

        .lesson-node__shadow {
          position: absolute;
          left: 0;
          top: 0;
          width: var(--node-width);
          height: var(--node-height);
          border-radius: 50%;
          background-color: var(--shadow);
          transform: translateY(var(--node-depth));
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.22);
          z-index: 1;
        }

        .lesson-node__face {
          position: absolute;
          left: 0;
          top: 0;
          width: var(--node-width);
          height: var(--node-height);
          border-radius: 50%;
          background-color: var(--face);
          background-image: radial-gradient(
            85% 60% at 50% 18%,
            rgba(255, 255, 255, 0.28) 0%,
            var(--highlight) 35%,
            var(--face-light) 60%,
            var(--face) 90%
          );
          z-index: 2;
          box-shadow:
            inset 0 3px 0 rgba(255, 255, 255, 0.45),
            inset 0 -3px 0 rgba(0, 0, 0, 0.15);
          transition: transform 100ms ease-out, filter 100ms ease-out;
        }

        .lesson-node__highlight {
          position: absolute;
          top: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse at 50% 25%,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.12) 50%,
            transparent 85%
          );
          filter: blur(1px);
          pointer-events: none;
        }

        .lesson-node__icon {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }

        .lesson-node__icon img,
        .lesson-node__icon svg {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)) contrast(1.15);
          transform: scale(1.04);
        }

        .lesson-node:hover:not(:disabled) .lesson-node__face {
          transform: translateY(3px);
          filter: brightness(1.03);
        }

        .lesson-node:active:not(:disabled) .lesson-node__face {
          transform: translateY(7px);
          filter: brightness(0.98);
        }

        .lesson-node--completed {
          --face: #10b981;
          --face-light: #34d399;
          --highlight: #6ee7b7;
          --shadow: #059669;
          cursor: pointer;
        }

        .lesson-node--locked {
          --face: oklch(37.2% 0.044 257.287);
          --face-light: oklch(42.5% 0.04 257.287);
          --highlight: oklch(50% 0.03 257.287);
          --shadow: oklch(28.5% 0.04 257.287);

          cursor: pointer;
          opacity: 0.92;
        }

        .lesson-node--locked .lesson-node__icon {
          color: oklch(55.1% 0.027 264.364);
          opacity: 0.85;
        }

        .lesson-node--locked .lesson-node__icon img {
          filter: brightness(1.2) contrast(0.95);
        }

        .lesson-node:focus-visible .lesson-node__face {
          outline: 2px solid rgba(255, 255, 255, 0.8);
          outline-offset: 3px;
        }

        @media (max-width: 768px) {
          .lesson-node {
            --node-width: 76px;
            --node-height: 70px;
            --node-depth: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default LessonNode;
