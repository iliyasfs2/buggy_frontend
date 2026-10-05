"use client";

import type { ReactElement } from "react";
import { AppShell } from "./AppShell";
import { SetupView } from "@/components/setup/SetupView";
import { PathView } from "@/components/path/PathView";
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
      {activeTab === "store" && (
        <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl mb-4">
            🛒
          </div>
          <h2 className="text-xl font-bold text-slate-100">Buggy Byte Store</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            Redeem Bytes for premium workspace gear and perks.
          </p>
        </div>
      )}
      {activeTab === "profile" && (
        <div className="p-8 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-3xl mb-4">
            👤
          </div>
          <h2 className="text-xl font-bold text-slate-100">Developer Profile</h2>
          <p className="text-slate-400 text-sm mt-1 max-w-sm">
            View your coding streaks, badges, and skill matrix.
          </p>
        </div>
      )}
    </AppShell>
  );
}
