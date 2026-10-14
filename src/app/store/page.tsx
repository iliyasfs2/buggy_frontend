import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { StoreView } from "@/components/store/StoreView";

export default function StorePage(): ReactElement {
  return (
    <RouteGuard>
      <AppShell>
        <StoreView />
      </AppShell>
    </RouteGuard>
  );
}
