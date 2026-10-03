"use client";

import type { ReactElement } from "react";
import {
  useNavStore,
  selectActiveTab,
  selectSetActiveTab,
} from "@/store/useNavStore";
import { NAVIGATION_ITEMS } from "@/constants/navigation";
import { BuggyLogo } from "@/components/shared";

export interface DesktopSidebarProps {
  className?: string;
}

export function DesktopSidebar({
  className = "",
}: DesktopSidebarProps): ReactElement {
  const activeTab = useNavStore(selectActiveTab);
  const setActiveTab = useNavStore(selectSetActiveTab);

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

        <nav aria-label="Main Sections" className="flex flex-col gap-2">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full gap-4 px-4 py-3.5 text-lg font-medium transition-colors rounded-xl ${
                  isActive
                    ? "bg-blue-950/60 text-blue-400 border border-blue-500/40"
                    : "text-white hover:text-white hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <Icon
                  className={`w-7 h-7 shrink-0 ${
                    isActive ? "text-blue-400" : "text-white"
                  }`}
                />
                <span>{item.label}</span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded ${
                      isActive
                        ? "bg-blue-900/60 text-blue-300 border border-blue-500/40"
                        : "bg-slate-800 text-slate-100 border border-slate-700/60"
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
