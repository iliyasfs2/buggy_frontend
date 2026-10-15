"use client";

import { useEffect, useState, type ReactNode } from "react";
import { getAuthToken } from "@/services/authApi";
import { useAuthStore } from "@/store/useAuthStore";

export function RouteGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initAuth = useAuthStore((state) => state.initAuth);

  const [authorized, setAuthorized] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return Boolean(getAuthToken() && useAuthStore.getState().isAuthenticated);
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      window.location.replace("/login");
      return;
    }

    if (isAuthenticated) {
      setAuthorized(true);
      return;
    }

    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted && !useAuthStore.getState().isAuthenticated) {
        window.location.replace("/login");
      }
    }, 4000);

    initAuth()
      .then(() => {
        if (!isMounted) return;
        if (!useAuthStore.getState().isAuthenticated) {
          window.location.replace("/login");
        } else {
          setAuthorized(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          window.location.replace("/login");
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [initAuth, isAuthenticated]);

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

