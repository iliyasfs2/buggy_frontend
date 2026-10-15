"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Volume2, VolumeX, LogOut, Check, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { soundEffects } from "@/utils/soundEffects";

export function SettingsView() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [dailyGoal, setDailyGoal] = useState<number>(1);
  const [savedToast, setSavedToast] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      soundEffects.playClick();
    }
    triggerSaveFeedback();
  };

  const triggerSaveFeedback = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleLogout = async () => {
    soundEffects.playSoftClick();
    await logout();
    router.push("/login");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8 pb-28 md:pb-12 select-none">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <Image
            src="/icons/settings.png"
            alt="Settings Gear"
            width={96}
            height={96}
            className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
            priority
          />
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Preferences & Settings
        </h1>
        <p className="text-sm font-bold text-slate-400 max-w-sm">
          Customize your sound, learning pace, and account experience.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Audio & Experience
          </h2>
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-200">
                    Sound Effects
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Audio feedback for answers and lesson completion
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleSound}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                  soundEnabled ? "bg-blue-600" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    soundEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="h-px bg-slate-800/80" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-200">
                    Visual Animations
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Mascot reactions and celebration effects
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAnimationsEnabled(!animationsEnabled);
                  triggerSaveFeedback();
                }}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer ${
                  animationsEnabled ? "bg-blue-600" : "bg-slate-800"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    animationsEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Daily Learning Goal
          </h2>
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4 shadow-md">
            <div className="grid grid-cols-3 gap-3">
              {[
                { count: 1, label: "Casual", sub: "1 lesson / day" },
                { count: 2, label: "Regular", sub: "2 lessons / day" },
                { count: 3, label: "Intense", sub: "3+ lessons / day" },
              ].map((g) => {
                const isSelected = dailyGoal === g.count;
                return (
                  <button
                    key={g.count}
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      setDailyGoal(g.count);
                      triggerSaveFeedback();
                    }}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                      isSelected
                        ? "bg-blue-600/15 border-blue-500 text-blue-400 shadow-sm"
                        : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider">
                      {g.label}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 mt-1">
                      {g.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Account & Security
          </h2>
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-200">
                  {user?.username || "Guest User"}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {user?.email || "guest@buggy.dev"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </section>
      </div>

      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          Settings saved
        </div>
      )}
    </div>
  );
}
