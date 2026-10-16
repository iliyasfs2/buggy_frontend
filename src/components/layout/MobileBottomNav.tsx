"use client";

import { useState, useRef, useEffect, type ReactElement } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const activeTab = useGameStore(selectActiveTab);
  const setActiveTab = useGameStore(selectSetActiveTab);
  const mistakesCount = useGameStore(selectMistakesCount);

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
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] md:hidden animate-in fade-in duration-150"
        />
      )}

      <nav
        aria-label="Mobile Navigation"
        className={`flex md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 items-stretch select-none px-4 ${className}`}
      >
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
              <div key={item.id} className="flex-1 relative h-full flex items-center justify-center">
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
                    <Icon className="w-8 h-auto" />
                  </div>
                  {isActive && (
                    <span className="absolute bottom-1 w-6 h-0.5 bg-blue-400 rounded-full" />
                  )}
                </button>

                {isMoreOpen && (
                  <div
                    ref={popoverRef}
                    className="absolute bottom-full right-0 mb-3 w-44 rounded-2xl bg-[#0f172a] border-2 border-slate-700/90 border-b-4 border-slate-950 shadow-2xl p-1.5 flex flex-col gap-1 z-50 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-150 select-none"
                  >
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0f172a] border-r-2 border-b-2 border-slate-700/90 rotate-45 pointer-events-none" />

                    {MORE_SUBITEMS.map((sub) => {
                      const isSubActive =
                        (sub.id === "leaderboard" && (pathname.startsWith("/leaderboard") || (pathname.startsWith("/profile/") && pathname !== "/profile"))) ||
                        (sub.id === "profile" && (pathname === "/profile" || pathname === "/profile/avatar")) ||
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
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-black text-xs tracking-wide transition-all cursor-pointer ${
                            isSubActive
                              ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                              : "text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800 active:scale-[0.98] border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <SubIcon
                              className={`w-5 h-5 shrink-0 transition-transform ${
                                isSubActive ? "text-blue-400 scale-110" : "text-slate-400"
                              }`}
                            />
                            <span>{sub.label}</span>
                          </div>
                          {isSubActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
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
                <Icon className="w-7 h-7 shrink-0" />
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
                <span className="absolute bottom-1 w-6 h-0.5 bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
