"use client";

import type { ReactElement } from "react";
import { DailyQuestsCard } from "@/components/quests/DailyQuestsCard";

export function PathSidebar(): ReactElement {
  return (
    <aside aria-label="Roadmap Quests and Stats" className="w-full flex flex-col gap-6 select-none">
      <DailyQuestsCard />
    </aside>
  );
}
