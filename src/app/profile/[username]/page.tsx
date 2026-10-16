import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { UserProfileDetailView } from "@/components/profile/UserProfileDetailView";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function DynamicUserProfilePage({ params }: PageProps): Promise<ReactElement> {
  const { username } = await params;

  return (
    <RouteGuard>
      <AppShell>
        <UserProfileDetailView username={username} />
      </AppShell>
    </RouteGuard>
  );
}
