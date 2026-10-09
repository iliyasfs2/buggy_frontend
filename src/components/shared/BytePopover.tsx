"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export interface BytePopoverProps {
  currentBytes: number;
  isOpen: boolean;
  onClose: () => void;
}

export function BytePopover({ currentBytes, isOpen, onClose }: BytePopoverProps) {
  const router = useRouter();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-transparent" onClick={onClose} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-14 sm:top-16 right-0 z-[70] w-[320px] bg-slate-900 border border-slate-700/60 border-b-4 border-slate-950 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(56,189,248,0.15)] flex flex-col origin-top-right"
          >
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-20 h-20 bg-sky-500/10 rounded-full flex items-center justify-center mb-4 relative drop-shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                <img src="/icons/byte.png" alt="Byte" className="w-16 h-16 object-contain" />
              </div>
              <h3 className="text-3xl font-black text-slate-100 font-mono mb-1">
                {currentBytes.toLocaleString()}
              </h3>
              <p className="text-[13px] font-medium text-slate-400">
                Bytes can be used to refill energy or buy power-ups in the store.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                router.push("/store");
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 active:border-b-[0px] text-white font-black text-[14px] uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5 fill-white" />
              Open Store
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
