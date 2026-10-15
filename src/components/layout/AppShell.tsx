"use client";

import type { ReactNode, ReactElement } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileBottomNav } from "./MobileBottomNav";

export interface AppShellProps {
  children?: ReactNode;
  className?: string;
}

export function AppShell({ children = null, className = "" }: AppShellProps): ReactElement {
  return (
    <div className={`min-h-screen bg-[#101826] text-slate-100 flex flex-col ${className}`}>
      <DesktopSidebar />
      <MobileHeader />
      <main className="flex-1 md:pl-64 min-h-screen pb-16 md:pb-0 bg-[#101826]">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
