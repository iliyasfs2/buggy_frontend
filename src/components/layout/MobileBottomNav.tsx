"use client";

import { useState, useRef, useEffect, type ReactElement } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  useGameStore,
  selectActiveTab,
  selectSetActiveTab,
  selectMistakesCount
} from "@/store/useGameStore";
import { MOBILE_NAVIGATION_ITEMS } from "@/constants/navigation";
import { LeaderboardIcon, ProfileIcon, SettingsIcon } from "@/components/shared";
import { soundEffects } from "@/utils/soundEffects";

export interface MobileBottomNavProps {
  className?: string;
}

const MORE_SUBITEMS = [
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: LeaderboardIcon,
    href: "/leaderboard",
  },
  {
    id: "profile",
    label: "Profile",
    icon: ProfileIcon,
    href: "/profile",
  },
  {
    id: "settings",
    label: "Settings",
    icon: SettingsIcon,
    href: "/settings",
  },
] as const;

export function MobileBottomNav({ className = "" }: MobileBottomNavProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = useGameStore(selectActiveTab);
  const setActiveTab = useGameStore(selectSetActiveTab);
  const mistakesCount = useGameStore(selectMistakesCount);

  const isFromLeaderboard = searchParams?.get("from") === "leaderboard";
  const isLeaderboardActive = pathname.startsWith("/leaderboard") || (pathname.startsWith("/profile") && isFromLeaderboard);
  const isProfileActive = pathname.startsWith("/profile") && !isFromLeaderboard;

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMoreOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isMoreOpen]);

  const isMoreActive =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/leaderboard") ||
    pathname.startsWith("/settings");

  return (
    <>
      {isMoreOpen && (
        <div
          role="presentation"
          onClick={() => setIsMoreOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] md:hidden animate-in fade-in duration-200"
        />
      )}

      <nav
        aria-label="Mobile Navigation"
        className={`flex md:hidden fixed bottom-0 inset-x-0 z-40 h-[calc(4rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-[#0b1329] border-t border-slate-800 items-stretch select-none px-2 ${className}`}
      >
        {isMoreOpen && (
          <div
            ref={popoverRef}
            className="absolute bottom-full inset-x-0 w-full bg-[#0b1329] border-t-2 border-slate-700/80 rounded-t-3xl shadow-[0_-12px_32px_rgba(0,0,0,0.7)] p-3.5 flex flex-col z-50 animate-in slide-in-from-bottom-4 fade-in duration-200 select-none"
          >
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-2.5 opacity-70" />

            <div className="flex flex-col divide-y divide-slate-800/80">
              {MORE_SUBITEMS.map((sub) => {
                const isSubActive =
                  (sub.id === "leaderboard" && isLeaderboardActive) ||
                  (sub.id === "profile" && isProfileActive) ||
                  (sub.id === "settings" && pathname.startsWith("/settings"));
                const SubIcon = sub.icon;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setIsMoreOpen(false);
                      router.push(sub.href);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3.5 rounded-2xl font-black text-sm tracking-wide transition-all cursor-pointer ${
                      isSubActive
                        ? "bg-blue-600/15 text-blue-400"
                        : "text-slate-200 hover:text-white hover:bg-slate-800/60 active:bg-slate-800 active:scale-[0.99]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isSubActive
                            ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                            : "bg-slate-800/90 border-slate-700/70 text-slate-300"
                        }`}
                      >
                        <SubIcon
                          className={`w-5 h-5 shrink-0 transition-transform ${
                            isSubActive ? "scale-110" : ""
                          }`}
                        />
                      </div>
                      <span className="text-sm font-black uppercase tracking-wider">
                        {sub.label}
                      </span>
                    </div>

                    {isSubActive ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.9)]" />
                    ) : (
                      <span className="text-slate-500 text-base font-black">›</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {MOBILE_NAVIGATION_ITEMS.map((item) => {
          const isItemMore = item.id === "more";
          const isActive = isItemMore
            ? isMoreActive
            : (pathname === "/store" && item.id === "store") ||
              (pathname.startsWith("/debug") && item.id === "debug") ||
              ((pathname === "/roadmap" || pathname === "/") && activeTab === item.id);
          const Icon = item.icon;
          const badgeCount = item.id === "debug" ? mistakesCount : item.badgeCount;

          if (isItemMore) {
            return (
              <div key={item.id} className="flex-1 h-full flex items-center justify-center">
                <button
                  type="button"
                  role="button"
                  aria-label="More Menu"
                  aria-expanded={isMoreOpen}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setIsMoreOpen((prev) => !prev);
                  }}
                  className={`w-full flex items-center justify-center relative h-full transition-colors cursor-pointer ${
                    isActive || isMoreOpen ? "text-blue-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <Icon className="w-9 h-auto transition-transform active:scale-95" />
                  </div>
                  {isActive && (
                    <span className="absolute bottom-1 w-7 h-0.5 bg-blue-400 rounded-full" />
                  )}
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              role="button"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              onClick={() => {
                soundEffects.playSoftClick();
                setIsMoreOpen(false);
                setActiveTab(item.id);
                if (item.id === "store") {
                  router.push("/store");
                } else if (item.id === "debug") {
                  router.push("/debug");
                } else {
                  if (pathname !== "/roadmap" && pathname !== "/") {
                    router.push("/roadmap");
                  }
                }
              }}
              className={`flex-1 flex items-center justify-center relative h-full transition-colors cursor-pointer ${
                isActive ? "text-blue-400" : "text-white hover:text-white"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className="w-8 h-8 shrink-0 transition-transform active:scale-95" />
                {badgeCount !== undefined && badgeCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full ${
                      item.id === "debug"
                        ? "bg-rose-500 text-white"
                        : isActive
                        ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                        : "bg-slate-800 text-slate-100 border border-slate-700/60"
                    }`}
                  >
                    {item.id === "debug" ? (badgeCount > 30 ? "30+" : badgeCount) : badgeCount}
                  </span>
                )}
              </div>
              {isActive && (
                <span className="absolute bottom-1 w-7 h-0.5 bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
