"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { AvatarRenderer } from "./AvatarRenderer";
import { AvatarCustomizerModal } from "./AvatarCustomizerModal";
import { StatisticsGrid } from "./StatisticsGrid";
import { AchievementsList } from "./AchievementsList";
import { soundEffects } from "@/utils/soundEffects";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import type { AvatarConfig } from "@/services/authApi";

export function ProfileView() {
  const { user, updateAvatar } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const username = user?.username || "Guest Coder";
  const email = user?.email || "guest@buggy.dev";
  const age = user?.age || 20;

  const joinDateFormatted = React.useMemo(() => {
    if (!user?.created_at) return "Joined Recently";
    try {
      const date = new Date(user.created_at);
      return `Joined ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
    } catch {
      return "Joined Recently";
    }
  }, [user?.created_at]);

  const handleSaveAvatar = async (config: AvatarConfig) => {
    await updateAvatar(config);
  };

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-32 md:pb-16 select-none">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col gap-8 shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full">
          <DesktopMetricBar inline />
        </div>
        <div className="relative w-full rounded-3xl bg-slate-900/90 border-2 border-slate-800 p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none" />

        <div className="relative mb-4 inline-flex items-center justify-center">
          <div className="w-[140px] h-[140px] rounded-full ring-4 ring-slate-800/80 shadow-[0_12px_28px_rgba(0,0,0,0.55)] flex items-center justify-center overflow-hidden bg-slate-900">
            <AvatarRenderer
              config={user?.avatar_config || user?.avatar}
              size={140}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playSoftClick();
              setIsEditModalOpen(true);
            }}
            aria-label="Change Avatar"
            className="absolute bottom-0 right-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 flex items-center justify-center border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 shadow-[0_6px_16px_rgba(245,158,11,0.5)] transition-all cursor-pointer group z-10"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              className="w-4 h-4 group-hover:scale-110 transition-transform"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {username}
            </h1>
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-sm">
              ✓
            </div>
          </div>

          <p className="text-xs font-bold text-slate-400">
            {email}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <span className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-300">
              🎂 {age} Years Old
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-300">
              📅 {joinDateFormatted}
            </span>
          </div>
        </div>
      </div>

      <StatisticsGrid />

      <AchievementsList />
    </div>

    <div className="hidden lg:flex flex-1 justify-center sticky top-8">
      <DesktopMetricBar inline />
    </div>

    <AvatarCustomizerModal
      isOpen={isEditModalOpen}
      initialConfig={user?.avatar_config || user?.avatar}
      onClose={() => setIsEditModalOpen(false)}
      onSave={handleSaveAvatar}
    />
  </div>
  );
}
