import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileView } from "@/components/profile/ProfileView";

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function DynamicUserProfilePage({ params, searchParams }: PageProps): Promise<ReactElement> {
  const { username } = await params;
  const { from } = await searchParams;

  return (
    <RouteGuard>
      <AppShell>
        <ProfileView key={username} username={username} from={from} />
      </AppShell>
    </RouteGuard>
  );
}
