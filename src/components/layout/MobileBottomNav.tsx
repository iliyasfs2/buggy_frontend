"use client";

import type { ReactElement } from "react";
import {
  useNavStore,
  selectActiveTab,
  selectSetActiveTab
} from "@/store/useNavStore";
import { NAVIGATION_ITEMS } from "@/constants/navigation";

export interface MobileBottomNavProps {
  className?: string;
}

export function MobileBottomNav({ className = "" }: MobileBottomNavProps): ReactElement {
  const activeTab = useNavStore(selectActiveTab);
  const setActiveTab = useNavStore(selectSetActiveTab);

  return (
    <nav
      aria-label="Mobile Navigation"
      className={`flex md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-[#0f172a]/95 backdrop-blur-md border-t border-slate-800 items-stretch select-none px-4 ${className}`}
    >
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            role="button"
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex items-center justify-center relative h-full transition-colors ${
              isActive ? "text-blue-400" : "text-white hover:text-white"
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Icon className="w-7 h-7 shrink-0" />
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  className={`absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full ${
                    isActive
                      ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                      : "bg-slate-800 text-slate-100 border border-slate-700/60"
                  }`}
                >
                  {item.badgeCount}
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
