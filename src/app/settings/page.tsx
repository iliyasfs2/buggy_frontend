import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { SettingsView } from "@/components/settings/SettingsView";

export default function SettingsPage(): ReactElement {
  return (
    <RouteGuard>
      <AppShell>
        <SettingsView />
      </AppShell>
    </RouteGuard>
  );
}
