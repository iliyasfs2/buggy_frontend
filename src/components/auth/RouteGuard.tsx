"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getAuthToken } from "@/services/authApi";
import { useAuthStore } from "@/store/useAuthStore";

export function RouteGuard({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      window.location.replace("/login");
      return;
    }

    initAuth()
      .then(() => {
        const authed = useAuthStore.getState().isAuthenticated;
        if (!authed) {
          window.location.replace("/login");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        window.location.replace("/login");
      });
  }, [initAuth]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#101826] flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">
            Checking session...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
