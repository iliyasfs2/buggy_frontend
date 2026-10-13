import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { HomeClient } from "@/components/layout/HomeClient";

export default function RoadmapPage(): ReactElement {
  return (
    <RouteGuard>
      <HomeClient />
    </RouteGuard>
  );
}
