import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";

export default function LeaderboardPage(): ReactElement {
  return (
    <RouteGuard>
      <AppShell>
        <LeaderboardView />
      </AppShell>
    </RouteGuard>
  );
}
