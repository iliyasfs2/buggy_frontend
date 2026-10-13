"use client";

import type { ReactElement } from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { AppShell } from "@/components/layout/AppShell";
import { AvatarCustomizer } from "@/components/profile/AvatarCustomizer";
import { useRouter } from "next/navigation";
import { soundEffects } from "@/utils/soundEffects";

export default function AvatarCreatorPage(): ReactElement {
  const router = useRouter();

  const handleBack = () => {
    soundEffects.playSoftClick();
    router.push("/profile");
  };

  return (
    <RouteGuard>
      <AppShell>
        <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span>←</span> Back to Profile
            </button>
            <h1 className="text-lg font-black text-white">
              Avatar Creator
            </h1>
          </div>

          <AvatarCustomizer
            onSaved={() => {
              setTimeout(() => {
                router.push("/profile");
              }, 600);
            }}
          />
        </div>
      </AppShell>
    </RouteGuard>
  );
}
