"use client";

import type { ReactElement } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  useGameStore,
  selectActiveTab,
  selectSetActiveTab,
  selectMistakesCount
} from "@/store/useGameStore";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { soundEffects } from "@/utils/soundEffects";

export interface MobileBottomNavProps {
  className?: string;
}

export function MobileBottomNav({ className = "" }: MobileBottomNavProps): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const activeTab = useGameStore(selectActiveTab);
  const setActiveTab = useGameStore(selectSetActiveTab);
  const mistakesCount = useGameStore(selectMistakesCount);

  return (
    <nav
      aria-label="Mobile Navigation"
      className={`flex md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 items-stretch select-none px-4 ${className}`}
    >
      {NAVIGATION_ITEMS.map((item) => {
        const isActive =
          (pathname === "/store" && item.id === "store") ||
          (pathname.startsWith("/profile") && item.id === "profile") ||
          (pathname.startsWith("/debug") && item.id === "debug") ||
          ((pathname === "/roadmap" || pathname === "/") && activeTab === item.id);
        const Icon = item.icon;
        const badgeCount = item.id === "debug" ? mistakesCount : item.badgeCount;

        return (
          <button
            key={item.id}
            type="button"
            role="button"
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              soundEffects.playSoftClick();
              setActiveTab(item.id);
              if (item.id === "profile") {
                router.push("/profile");
              } else if (item.id === "store") {
                router.push("/store");
              } else if (item.id === "debug") {
                router.push("/debug");
              } else {
                if (pathname !== "/roadmap" && pathname !== "/") {
                  router.push("/roadmap");
                }
              }
            }}
            className={`flex-1 flex items-center justify-center relative h-full transition-colors ${
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
  );
}
