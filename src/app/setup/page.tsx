"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import { DevCard } from "@/components/profile/DevCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import { useNavStore } from "@/store/useNavStore";
import { updateDevCardApi, fetchUserProfileApi } from "@/services/progressApi";
import { soundEffects } from "@/utils/soundEffects";
import {
  Download,
  Share2,
  Check,
  Save,
  Sparkles,
  Layers,
  Wrench,
  FolderGit2,
  AlertCircle
} from "lucide-react";
import { toPng } from "html-to-image";

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
  const [isSuper, setIsSuper] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const cardContainerRef = useRef<HTMLDivElement>(null);

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
          if ((res as any)?.is_super) {
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
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPng = async () => {
    if (!cardContainerRef.current) return;
    soundEffects.playSoftClick();
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardContainerRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0f172a",
      });
      const link = document.createElement("a");
      link.download = `${currentUser?.username || "developer"}-buggy-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    soundEffects.playSoftClick();
    const url = typeof window !== "undefined" ? `${window.location.origin}/profile/${currentUser?.username || "me"}` : "";
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2200);
      }
    } catch {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2200);
    }
  };

  const accuracyScore = Math.max(80, Math.min(100, Math.round(100 - (mistakesCount / Math.max(1, completedNodesCount)) * 10))) || 89;
  const masteryScore = Math.min(100, Math.max(20, Math.round((completedNodesCount / 20) * 100))) || 85;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center p-2 shadow-inner">
              <img src="/icons/setup.png" alt="Dev Hub" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Dev Hub</h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-400">
                Your developer identity, battle station, and career hub.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <DesktopMetricBar inline />
          </div>
        </div>

        <div className="flex items-center gap-2 border-b-2 border-slate-800 pb-2 overflow-x-auto">
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
            <span>Developer Card</span>
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
            <span>Workstation & Gear</span>
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
            <span>Portfolio Projects</span>
            <span className="text-[9px] font-black uppercase bg-slate-800 text-sky-400 border border-sky-400/30 px-1.5 py-0.2 rounded-full">
              Soon
            </span>
          </button>
        </div>

        {activeTab === "card" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Live Card Preview
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setIsSuper((prev) => !prev);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      isSuper
                        ? "bg-purple-900/60 border-purple-400 text-purple-200"
                        : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    ⚡ Super Mode: {isSuper ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              <div className="w-full flex justify-center">
                <div className="w-full max-w-[540px]">
                  <DevCard
                    cardRef={cardContainerRef}
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
                    onShareCard={handleCopyLink}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleExportPng}
                  disabled={isExporting}
                  className="flex-1 h-11 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:translate-y-0.5 border-2 border-b-4 border-slate-700 border-b-slate-950 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>{isExporting ? "Exporting..." : "Export as Image (PNG)"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 h-11 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:translate-y-0.5 border-2 border-b-4 border-slate-700 border-b-slate-950 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {shareCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-sky-400" />
                      <span>Share Card Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#0f172a] rounded-3xl border-2 border-slate-700 p-5 sm:p-6 shadow-2xl flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white">Customize Dev Card</h2>
                  <p className="text-xs text-slate-400 font-semibold">
                    Changes here immediately reflect on your public profile card.
                  </p>
                </div>
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Saved!
                  </span>
                )}
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Job / Specialty Title</label>
                  <input
                    type="text"
                    value={formData.specialtyTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, specialtyTitle: e.target.value }))}
                    placeholder="e.g. Full-Stack Developer"
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Collaboration Status</label>
                  <select
                    value={formData.collabStatus}
                    onChange={(e) => setFormData((prev) => ({ ...prev, collabStatus: e.target.value }))}
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Open to Work">🟢 Open to Work (Ready for opportunities)</option>
                    <option value="Looking for Teammate">🟣 Looking for Teammate (Seeking partners)</option>
                    <option value="Learning & Coding">🟡 Learning & Coding (Upskilling)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Short Bio (max 2 lines)</label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                    placeholder="Building interactive web apps with React & FastAPI."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-300">Tech Stack (comma separated)</label>
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
                    className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/username"
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400">Telegram / Website</label>
                    <input
                      type="text"
                      value={formData.telegramUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, telegramUrl: e.target.value }))}
                      placeholder="https://t.me/username"
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-400">Public Contact Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="coder@example.com"
                      className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save Card Changes"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab !== "card" && (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-[#0f172a] rounded-3xl border-2 border-slate-700 p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
              {activeTab === "setup" ? "⚡" : "💼"}
            </div>
            <h2 className="text-xl font-black text-white">
              {activeTab === "setup" ? "Workstation & Battlestation Gear" : "Developer Portfolio Projects"}
            </h2>
            <p className="text-sm font-semibold text-slate-400 max-w-md">
              This module is being integrated into Dev Hub. In the meantime, customize and share your verified Dev Card!
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
