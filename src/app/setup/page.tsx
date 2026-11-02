"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import { DevCard } from "@/components/profile/DevCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import { useNavStore } from "@/store/useNavStore";
import { updateDevCardApi, fetchUserProfileApi } from "@/services/progressApi";
import { soundEffects } from "@/utils/soundEffects";
import {
  Check,
  Save,
  Layers,
  Wrench,
  FolderGit2
} from "lucide-react";

interface DevCardFormState {
  specialtyTitle: string;
  collabStatus: string;
  bio: string;
  techStack: string[];
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  telegramUrl: string;
  email: string;
}

const DEFAULT_FORM: DevCardFormState = {
  specialtyTitle: "Full-Stack Developer",
  collabStatus: "Open to Work",
  bio: "Building interactive web apps with React & FastAPI.",
  techStack: ["JavaScript", "React", "TypeScript", "Python", "FastAPI"],
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  websiteUrl: "https://buggy.dev",
  telegramUrl: "https://t.me",
  email: "coder@buggy.dev",
};

export default function SetupDevHubPage() {
  const { user: currentUser } = useAuthStore();
  const streakCount = useGameStore((s) => s.streakCount);
  const completedNodesCount = useNavStore((s) => s.completedNodesCount);
  const mistakesCount = useNavStore((s) => s.mistakesCount);

  const [activeTab, setActiveTab] = useState<"card" | "setup" | "projects">("card");
  const [formData, setFormData] = useState<DevCardFormState>(DEFAULT_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const storageKey = `buggy_dev_card_${currentUser?.id || currentUser?.username || "default"}`;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {}

    if (currentUser?.id) {
      fetchUserProfileApi(String(currentUser.id))
        .then((res) => {
          if (res?.dev_card && typeof res.dev_card === "object" && Object.keys(res.dev_card).length > 0) {
            setFormData((prev) => ({ ...prev, ...res.dev_card }));
          }
          if ((res as any)?.is_super || (currentUser as any)?.is_super) {
            setIsSuper(true);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSoftClick();
    setIsSaving(true);
    setSaveSuccess(false);

    const storageKey = `buggy_dev_card_${currentUser?.id || currentUser?.username || "default"}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(formData));
      await updateDevCardApi(formData);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const accuracyScore = Math.max(80, Math.min(100, Math.round(100 - (mistakesCount / Math.max(1, completedNodesCount)) * 10))) || 89;
  const masteryScore = Math.min(100, Math.max(20, Math.round((completedNodesCount / 20) * 100))) || 85;

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center p-2 shadow-inner">
              <img src="/icons/setup.png" alt="Dev Hub" className="w-6 h-6 object-contain" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Dev Hub</h1>
          </div>

          <div className="hidden md:flex items-center">
            <DesktopMetricBar inline />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-b-2 border-slate-800 pb-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("card");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeTab === "card"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Dev Card</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("setup");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeTab === "setup"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Workstation</span>
              <span className="text-[9px] font-black uppercase bg-slate-800 text-amber-400 border border-amber-400/30 px-1.5 py-0.2 rounded-full">
                Soon
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("projects");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                activeTab === "projects"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects</span>
              <span className="text-[9px] font-black uppercase bg-slate-800 text-sky-400 border border-sky-400/30 px-1.5 py-0.2 rounded-full">
                Soon
              </span>
            </button>
          </div>

          {saveSuccess && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-xs flex items-center gap-1.5 shrink-0 animate-in fade-in duration-200">
              <Check className="w-3.5 h-3.5" />
              Saved!
            </span>
          )}
        </div>

        {activeTab === "card" && (
          <div className="w-full max-w-[880px] mx-auto pt-1">
            {!isEditing ? (
              <DevCard
                displayName={currentUser?.username || "Iliya Mehri"}
                username={currentUser?.username || "iliya"}
                avatarConfig={currentUser?.avatar_config || currentUser?.avatar}
                specialtyTitle={formData.specialtyTitle}
                collabStatus={formData.collabStatus}
                bio={formData.bio}
                isSuper={isSuper}
                streakCount={streakCount || 42}
                bugsHunted={completedNodesCount ? completedNodesCount * 3 : 128}
                accuracy={accuracyScore}
                masteryPercent={masteryScore}
                techStack={formData.techStack}
                socialLinks={{
                  githubUrl: formData.githubUrl,
                  linkedinUrl: formData.linkedinUrl,
                  websiteUrl: formData.websiteUrl,
                  telegramUrl: formData.telegramUrl,
                  email: formData.email,
                }}
                isMe={true}
                editButtonText="Edit Card"
                onEditInDevHub={() => {
                  soundEffects.playSoftClick();
                  setIsEditing(true);
                }}
              />
            ) : (
              <div className="bg-[#0f172a] rounded-3xl border-2 border-slate-700 p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in duration-200">
                <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
                  <h2 className="text-lg font-black text-white tracking-wide">Edit Dev Card</h2>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setIsEditing(false);
                    }}
                    className="text-xs font-black text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSave} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-300 uppercase tracking-wide">Title</label>
                        <input
                          type="text"
                          value={formData.specialtyTitle}
                          onChange={(e) => setFormData((prev) => ({ ...prev, specialtyTitle: e.target.value }))}
                          placeholder="e.g. Full-Stack Developer"
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-300 uppercase tracking-wide">Status</label>
                        <select
                          value={formData.collabStatus}
                          onChange={(e) => setFormData((prev) => ({ ...prev, collabStatus: e.target.value }))}
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                          <option value="Open to Work">🟢 Open to Work</option>
                          <option value="Looking for Teammate">🟣 Looking for Teammate</option>
                          <option value="Learning & Coding">🟡 Learning & Coding</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-300 uppercase tracking-wide">Bio</label>
                        <textarea
                          rows={2}
                          value={formData.bio}
                          onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                          placeholder="Building interactive web apps with React & FastAPI."
                          className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-black text-slate-300 uppercase tracking-wide">Tech Stack</label>
                        <input
                          type="text"
                          value={formData.techStack.join(", ")}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              techStack: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="JavaScript, React, TypeScript, Python, FastAPI"
                          className="w-full h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">GitHub</label>
                          <input
                            type="text"
                            value={formData.githubUrl}
                            onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                            placeholder="https://github.com/username"
                            className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">LinkedIn</label>
                          <input
                            type="text"
                            value={formData.linkedinUrl}
                            onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Telegram / Web</label>
                          <input
                            type="text"
                            value={formData.telegramUrl}
                            onChange={(e) => setFormData((prev) => ({ ...prev, telegramUrl: e.target.value }))}
                            placeholder="https://t.me/username"
                            className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Email</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="coder@example.com"
                            className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playSoftClick();
                        setIsEditing(false);
                      }}
                      className="flex-1 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-slate-300 font-black text-sm uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 h-11 rounded-2xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab !== "card" && (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-4 bg-[#0f172a] rounded-3xl border-2 border-slate-700 p-8 max-w-[880px] mx-auto w-full">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
              {activeTab === "setup" ? "⚡" : "💼"}
            </div>
            <h2 className="text-xl font-black text-white">
              {activeTab === "setup" ? "Workstation Gear" : "Portfolio Projects"}
            </h2>
            <p className="text-sm font-black text-slate-400 max-w-md">
              Coming Soon
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
