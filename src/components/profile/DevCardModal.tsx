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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full min-h-screen md:min-h-0 md:w-full md:max-w-[880px] bg-[#0c162c] md:bg-transparent flex flex-col justify-center relative p-3 sm:p-4 md:p-0 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => {
            soundEffects.playSoftClick();
            onClose();
          }}
          aria-label="Close Dev Card"
          className="absolute top-4 right-4 md:-top-3 md:-right-3 z-30 w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-lg cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="w-full my-auto py-8 md:py-0">
          <DevCard {...cardProps} />
        </div>
      </div>
    </div>
  );
}
