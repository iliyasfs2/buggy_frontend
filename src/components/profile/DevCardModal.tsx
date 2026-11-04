"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { soundEffects } from "@/utils/soundEffects";
import { DevCard, DevCardProps } from "./DevCard";

export interface DevCardModalProps extends DevCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevCardModal({
  isOpen,
  onClose,
  ...cardProps
}: DevCardModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0c162c] md:bg-black/80 md:backdrop-blur-md flex flex-col md:items-center md:justify-center p-0 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full min-h-screen md:min-h-0 md:w-full md:max-w-[1060px] bg-[#0c162c] md:bg-transparent flex flex-col relative px-3 pb-6 pt-2 sm:px-5 md:p-0 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex md:hidden items-center justify-between py-2.5 px-1 shrink-0">
          <span className="text-base font-black text-white tracking-wide">Developer Card</span>
          <button
            type="button"
            onClick={() => {
              soundEffects.playSoftClick();
              onClose();
            }}
            aria-label="Close Dev Card"
            className="w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEffects.playSoftClick();
            onClose();
          }}
          aria-label="Close Dev Card"
          className="hidden md:flex absolute -top-3.5 -right-3.5 z-30 w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 items-center justify-center text-slate-300 hover:text-white transition-all shadow-lg cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="w-full my-auto">
          <DevCard {...cardProps} />
        </div>
      </div>
    </div>
  );
}
