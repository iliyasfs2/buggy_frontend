import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { UserProfileDetailView } from "@/components/profile/UserProfileDetailView";

export default function ProfilePage(): ReactElement {
  return (
    <RouteGuard>
      <AppShell>
        <UserProfileDetailView username="current" />
      </AppShell>
    </RouteGuard>
  );
}
