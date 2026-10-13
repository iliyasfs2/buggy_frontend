import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileView } from "@/components/profile/ProfileView";

export default function ProfilePage(): ReactElement {
  return (
    <RouteGuard>
      <AppShell>
        <ProfileView />
      </AppShell>
    </RouteGuard>
  );
}
