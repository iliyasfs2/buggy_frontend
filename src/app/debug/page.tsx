import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { DebugView } from "@/components/debug/DebugView";

export default function DebugPage(): ReactElement {
  return (
    <RouteGuard>
      <AppShell>
        <DebugView />
      </AppShell>
    </RouteGuard>
  );
}
