"use client";

import type { ReactElement } from "react";
import { AppShell } from "./AppShell";
import { SetupView } from "@/components/setup/SetupView";
import { PathView } from "@/components/path/PathView";
import { ProfileView } from "@/components/profile/ProfileView";
import { StoreView } from "@/components/store/StoreView";
import { useNavStore, selectActiveTab } from "@/store/useNavStore";
import { useMounted } from "@/hooks/useMounted";

export function HomeClient(): ReactElement {
  const mounted = useMounted();
  const activeTab = useNavStore(selectActiveTab);

  if (!mounted) {
    return (
      <AppShell>
        <PathView />
      </AppShell>
    );
  }

  return (
    <AppShell>
      {activeTab === "path" && <PathView />}
      {activeTab === "setup" && <SetupView />}
      {activeTab === "debug" && (
        <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mb-4">
            🐛
          </div>
          <h2 className="text-xl font-bold text-slate-100">Bug Vault Sandbox</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            Web Worker client-side sandboxed challenges.
          </p>
        </div>
      )}
      {activeTab === "store" && <StoreView />}
      {activeTab === "profile" && <ProfileView />}
    </AppShell>
  );
}
