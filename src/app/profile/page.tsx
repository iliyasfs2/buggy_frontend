import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileView } from "@/components/profile/ProfileView";

interface PageProps {
  searchParams?: Promise<{ from?: string }>;
}

export default async function ProfilePage({ searchParams }: PageProps): Promise<ReactElement> {
  const resolvedParams = searchParams ? await searchParams : undefined;

  return (
    <RouteGuard>
      <AppShell>
        <ProfileView isOwnProfile={true} is_me={true} from={resolvedParams?.from} />
      </AppShell>
    </RouteGuard>
  );
}
