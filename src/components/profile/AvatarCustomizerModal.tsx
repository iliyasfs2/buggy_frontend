"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AvatarConfig } from "@/services/authApi";
import { AvatarCustomizer } from "./AvatarCustomizer";
import { soundEffects } from "@/utils/soundEffects";

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  initialConfig?: AvatarConfig | null;
  onClose: () => void;
  onSave?: (config: AvatarConfig) => Promise<void>;
}

export function AvatarCustomizerModal({
  isOpen,
  initialConfig,
  onClose,
}: AvatarCustomizerModalProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    soundEffects.playSoftClick();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl bg-slate-900 border-2 border-slate-800 p-5 sm:p-7 shadow-2xl z-10 flex flex-col"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>🎨</span> Customize Avatar
            </h2>
            <button
              onClick={handleClose}
              className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>

          <AvatarCustomizer
            initialConfig={initialConfig}
            onSaved={() => {
              setTimeout(() => {
                onClose();
              }, 400);
            }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
