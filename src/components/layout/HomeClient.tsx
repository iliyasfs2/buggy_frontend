"use client";

import type { ReactElement } from "react";
import { AppShell } from "./AppShell";
import { SetupView } from "@/components/setup/SetupView";
import { PathView } from "@/components/path/PathView";
import { ProfileView } from "@/components/profile/ProfileView";
import { StoreView } from "@/components/store/StoreView";
import { DebugView } from "@/components/debug/DebugView";
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
      {activeTab === "debug" && <DebugView />}
      {activeTab === "store" && <StoreView />}
      {activeTab === "profile" && <ProfileView />}
    </AppShell>
  );
}
