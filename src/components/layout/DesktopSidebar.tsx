"use client";

import type { ReactElement } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  useGameStore,
  selectActiveTab,
  selectSetActiveTab,
  selectMistakesCount,
} from "@/store/useGameStore";
import { useAuthStore } from "@/store/useAuthStore";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { BuggyLogo } from "@/components/shared";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { soundEffects } from "@/utils/soundEffects";

export interface DesktopSidebarProps {
  className?: string;
}

export function DesktopSidebar({
  className = "",
}: DesktopSidebarProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = useGameStore(selectActiveTab);
  const setActiveTab = useGameStore(selectSetActiveTab);
  const mistakesCount = useGameStore(selectMistakesCount);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside
      role="navigation"
      aria-label="Desktop Navigation"
      className={`hidden md:flex flex-col w-64 h-screen fixed inset-y-0 left-0 bg-[#101826] border-r-4 border-slate-700 z-40 select-none p-4 justify-between ${className}`}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center px-4">
          <BuggyLogo className="h-11 w-auto object-contain" />
        </div>

        <nav className="flex flex-col gap-1.5" aria-label="Main menu">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive =
              (pathname === "/store" && item.id === "store") ||
              (pathname.startsWith("/profile") && item.id === "profile") ||
              (pathname.startsWith("/debug") && item.id === "debug") ||
              (pathname.startsWith("/leaderboard") && item.id === "leaderboard") ||
              (pathname.startsWith("/settings") && item.id === "settings") ||
              ((pathname === "/roadmap" || pathname === "/") && activeTab === item.id);
            const Icon = item.icon;
            const badgeCount = item.id === "debug" ? mistakesCount : item.badgeCount;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab(item.id);
                  if (item.id === "profile") {
                    router.push("/profile");
                  } else if (item.id === "store") {
                    router.push("/store");
                  } else if (item.id === "debug") {
                    router.push("/debug");
                  } else if (item.id === "leaderboard") {
                    router.push("/leaderboard");
                  } else if (item.id === "settings") {
                    router.push("/settings");
                  } else {
                    if (pathname !== "/roadmap" && pathname !== "/") {
                      router.push("/roadmap");
                    }
                  }
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-black text-sm tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 border-2 border-b-4 border-blue-500 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon
                    className={`w-6 h-6 transition-transform ${
                      isActive ? "scale-110 text-blue-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {badgeCount !== undefined && badgeCount > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-black ${
                      item.id === "debug"
                        ? "bg-rose-500 text-white shadow-sm"
                        : isActive
                        ? "bg-blue-900/60 text-blue-300 border border-blue-500/40"
                        : "bg-slate-800 text-slate-100 border border-slate-700/60"
                    }`}
                  >
                    {item.id === "debug" ? (badgeCount > 30 ? "30+" : badgeCount) : badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {user && (
        <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full ring-2 ring-slate-800 shrink-0 overflow-hidden bg-slate-950 flex items-center justify-center">
                <AvatarRenderer
                  config={user.avatar_config || user.avatar}
                  size={36}
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-white truncate leading-tight">
                  {user.username}
                </p>
                <p className="text-[11px] font-bold text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
