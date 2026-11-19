"use client";

import React from "react";
import { DailyQuestsWidget } from "./DailyQuestsWidget";

export function DailyQuestsCard({ className = "" }: { className?: string }) {
  return <DailyQuestsWidget className={className} />;
}

export { DailyQuestsWidget };
