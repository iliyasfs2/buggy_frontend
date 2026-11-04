"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DevCard, type DevProjectItem } from "@/components/profile/DevCard";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
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
  FolderGit2,
  X,
  Plus,
  Github,
  Linkedin,
  Send,
  Globe,
  Mail,
  ShieldCheck,
  Sparkles,
  Link2,
  Trash2,
  Briefcase,
  Users,
  Code2
} from "lucide-react";

interface DevCardFormState {
  specialtyTitle: string;
  collabStatus: string;
  bio: string;
  techStack: string[];
  projects: DevProjectItem[];
  githubUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
  telegramUrl: string;
  email: string;
}

type SocialKey = "githubUrl" | "linkedinUrl" | "telegramUrl" | "websiteUrl" | "email";

const DEFAULT_PROJECTS: DevProjectItem[] = [
  {
    id: "p1",
    title: "Buggy Platform",
    desc: "Gamified platform to learn coding and debugging.",
    link: "https://buggy.dev",
  },
  {
    id: "p2",
    title: "SmartCode Runner",
    desc: "Interactive client sandbox with AST diagnostics.",
    link: "https://github.com",
  },
];

const DEFAULT_FORM: DevCardFormState = {
  specialtyTitle: "Full-Stack Developer",
  collabStatus: "Open to Work",
  bio: "Building interactive web apps with React & FastAPI.",
  techStack: ["JavaScript", "React", "TypeScript", "Python", "FastAPI"],
  projects: DEFAULT_PROJECTS,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  websiteUrl: "https://buggy.dev",
  telegramUrl: "https://t.me",
  email: "coder@buggy.dev",
};

const STATUS_OPTIONS = [
  {
    value: "Open to Work",
    shortLabel: "Open",
    fullLabel: "Open",
    icon: <Briefcase className="w-3.5 h-3.5 shrink-0" />,
    dot: "bg-emerald-400",
    activeClass:
      "bg-gradient-to-r from-emerald-500/25 to-teal-500/15 border border-emerald-400/50 text-emerald-200 shadow-sm",
    idleClass:
      "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80",
  },
  {
    value: "Looking for Teammate",
    shortLabel: "Co-op",
    fullLabel: "Teammate",
    icon: <Users className="w-3.5 h-3.5 shrink-0" />,
    dot: "bg-purple-400",
    activeClass:
      "bg-gradient-to-r from-purple-500/25 to-fuchsia-500/15 border border-purple-400/50 text-purple-200 shadow-sm",
    idleClass:
      "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80",
  },
  {
    value: "Learning & Coding",
    shortLabel: "Focus",
    fullLabel: "Learning",
    icon: <Code2 className="w-3.5 h-3.5 shrink-0" />,
    dot: "bg-amber-400",
    activeClass:
      "bg-gradient-to-r from-amber-500/25 to-orange-500/15 border border-amber-400/50 text-amber-200 shadow-sm",
    idleClass:
      "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80",
  },
];

const SOCIAL_TABS: {
  key: SocialKey;
  label: string;
  placeholder: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "githubUrl",
    label: "GitHub",
    placeholder: "https://github.com/username",
    icon: <Github className="w-4 h-4" />,
  },
  {
    key: "linkedinUrl",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    icon: <Linkedin className="w-4 h-4" />,
  },
  {
    key: "telegramUrl",
    label: "Telegram",
    placeholder: "https://t.me/username",
    icon: <Send className="w-4 h-4" />,
  },
  {
    key: "websiteUrl",
    label: "Website",
    placeholder: "https://yourportfolio.dev",
    icon: <Globe className="w-4 h-4" />,
  },
  {
    key: "email",
    label: "Email",
    placeholder: "you@domain.com",
    icon: <Mail className="w-4 h-4" />,
  },
];

function cloneCardState(state: DevCardFormState): DevCardFormState {
  return {
    ...state,
    techStack: Array.isArray(state.techStack) ? [...state.techStack] : [],
    projects: Array.isArray(state.projects)
      ? state.projects.map((p) => ({ ...p }))
      : DEFAULT_PROJECTS.map((p) => ({ ...p })),
  };
}

export default function DevHubPage() {
  const { user: currentUser } = useAuthStore();
  const streakCount = useGameStore((s) => s.streakCount);
  const completedNodesCount = useNavStore((s) => s.completedNodesCount);
  const mistakesCount = useNavStore((s) => s.mistakesCount);

  const [activeTab, setActiveTab] = useState<"card" | "setup" | "projects">("card");
  const [formData, setFormData] = useState<DevCardFormState>(DEFAULT_FORM);
  const [draftData, setDraftData] = useState<DevCardFormState>(DEFAULT_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSocialKey, setActiveSocialKey] = useState<SocialKey>("githubUrl");
  const [techInput, setTechInput] = useState("");
  const [isSuper, setIsSuper] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const storageKey = `buggy_dev_card_${currentUser?.id || currentUser?.username || "default"}`;
    let merged: DevCardFormState = cloneCardState(DEFAULT_FORM);

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          merged = {
            ...merged,
            ...parsed,
            techStack: Array.isArray(parsed.techStack) ? parsed.techStack : merged.techStack,
            projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : merged.projects,
          };
          setFormData(cloneCardState(merged));
          setDraftData(cloneCardState(merged));
        }
      }
    } catch {}

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("edit") === "1") {
        setIsEditing(true);
        window.history.replaceState({}, "", "/dev-hub");
      }
    }

    if (currentUser?.id) {
      fetchUserProfileApi(String(currentUser.id))
        .then((res) => {
          if (res?.dev_card && typeof res.dev_card === "object" && Object.keys(res.dev_card).length > 0) {
            const apiCard = res.dev_card as Partial<DevCardFormState>;
            setFormData((prev) => {
              const next: DevCardFormState = {
                ...prev,
                ...apiCard,
                techStack: Array.isArray(apiCard.techStack) ? apiCard.techStack : prev.techStack,
                projects:
                  Array.isArray(apiCard.projects) && apiCard.projects.length > 0
                    ? apiCard.projects
                    : prev.projects,
              };
              setDraftData((currDraft) => (isEditing ? currDraft : cloneCardState(next)));
              return next;
            });
          }
          if ((res as any)?.is_super || (currentUser as any)?.is_super) {
            setIsSuper(true);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const openEditor = useCallback(() => {
    soundEffects.playSoftClick();
    setDraftData(cloneCardState(formData));
    setTechInput("");
    setIsEditing(true);
  }, [formData]);

  const cancelEditor = useCallback(() => {
    soundEffects.playSoftClick();
    setDraftData(cloneCardState(formData));
    setTechInput("");
    setIsEditing(false);
  }, [formData]);

  const commitSave = useCallback(async () => {
    if (isSaving) return;
    soundEffects.playSoftClick();
    setIsSaving(true);
    setSaveSuccess(false);

    const pendingSkill = techInput.trim();
    const cleanedStack = [...draftData.techStack];
    if (
      pendingSkill &&
      cleanedStack.length < 8 &&
      !cleanedStack.some((s) => s.toLowerCase() === pendingSkill.toLowerCase())
    ) {
      cleanedStack.push(pendingSkill);
    }

    const cleanedProjects = draftData.projects
      .map((p) => ({
        id: p.id,
        title: p.title.trim() || "Untitled Project",
        desc: p.desc.trim() || "Built with modern web technologies.",
        link: p.link.trim(),
      }))
      .slice(0, 2);

    const nextSaved: DevCardFormState = {
      ...draftData,
      specialtyTitle: draftData.specialtyTitle.trim() || "Full-Stack Developer",
      bio: draftData.bio.trim() || "Building interactive web apps with React & FastAPI.",
      techStack: cleanedStack.length > 0 ? cleanedStack : ["JavaScript"],
      projects: cleanedProjects,
    };

    setFormData(cloneCardState(nextSaved));
    setDraftData(cloneCardState(nextSaved));
    setTechInput("");

    const storageKey = `buggy_dev_card_${currentUser?.id || currentUser?.username || "default"}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextSaved));
      await updateDevCardApi(nextSaved);
    } catch {}

    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }, [currentUser, draftData, isSaving, techInput]);

  useEffect(() => {
    if (!isEditing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelEditor();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        commitSave();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEditing, cancelEditor, commitSave]);

  const handleAddSkill = (rawSkill: string) => {
    const clean = rawSkill.replace(/,/g, "").trim();
    if (!clean) return;
    if (draftData.techStack.length >= 8) {
      setTechInput("");
      return;
    }
    if (draftData.techStack.some((t) => t.toLowerCase() === clean.toLowerCase())) {
      setTechInput("");
      return;
    }
    soundEffects.playSoftClick();
    setDraftData((prev) => ({
      ...prev,
      techStack: [...prev.techStack, clean],
    }));
    setTechInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    soundEffects.playSoftClick();
    setDraftData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((item) => item !== skillToRemove),
    }));
  };

  const handleUpdateProject = (id: string, field: keyof DevProjectItem, value: string) => {
    setDraftData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const handleAddProject = () => {
    if (draftData.projects.length >= 2) return;
    soundEffects.playSoftClick();
    setDraftData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: `proj_${Date.now()}`,
          title: "New Project",
          desc: "Short summary of what you built.",
          link: "https://github.com",
        },
      ],
    }));
  };

  const handleRemoveProject = (id: string) => {
    soundEffects.playSoftClick();
    setDraftData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const displayName = currentUser?.username || "Iliya Mehri";
  const usernameHandle = currentUser?.username || "iliya";
  const effectiveStreak = streakCount || 42;
  const effectiveBugs = completedNodesCount ? completedNodesCount * 3 : 128;
  const accuracyScore =
    Math.max(80, Math.min(100, Math.round(100 - (mistakesCount / Math.max(1, completedNodesCount)) * 10))) || 89;
  const masteryScore = Math.min(100, Math.max(20, Math.round((completedNodesCount / 20) * 100))) || 85;

  const activeSocialMeta = SOCIAL_TABS.find((t) => t.key === activeSocialKey) || SOCIAL_TABS[0];

  const editorCardBody = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        commitSave();
      }}
      className={`bg-[#0f172a] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 h-auto md:h-[510px] flex flex-col relative transition-colors ${
        isSuper
          ? ""
          : "border-2 border-blue-500/60 shadow-[0_0_35px_rgba(37,99,235,0.18)]"
      }`}
    >
      <div className="flex flex-col gap-5 md:grid md:grid-cols-12 md:gap-7 lg:gap-9 flex-1 min-h-0">
        <div className="md:col-span-5 flex flex-col gap-3.5 sm:gap-4 md:border-r-2 md:border-slate-800/90 md:pr-7 lg:pr-9 min-h-0">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 shrink-0">
            <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-full border-2 border-blue-500/40 bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
              <AvatarRenderer config={currentUser?.avatar_config || currentUser?.avatar} size={70} />
            </div>
            <div className="flex flex-col min-w-0 flex-1 gap-1">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                {displayName}
              </h3>
              <input
                type="text"
                maxLength={40}
                value={draftData.specialtyTitle}
                onChange={(e) =>
                  setDraftData((prev) => ({ ...prev, specialtyTitle: e.target.value }))
                }
                placeholder="Role title (e.g. Full-Stack Developer)"
                className="w-full h-9 px-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-400 text-xs sm:text-sm font-extrabold text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="w-full h-11 p-1 rounded-2xl bg-slate-950/90 border border-slate-800 grid grid-cols-3 gap-1 shrink-0">
            {STATUS_OPTIONS.map((opt) => {
              const active =
                draftData.collabStatus.toLowerCase() === opt.value.toLowerCase();
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    setDraftData((prev) => ({ ...prev, collabStatus: opt.value }));
                  }}
                  className={`h-full px-2 rounded-xl text-[11px] sm:text-xs font-black inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
                    active ? opt.activeClass : opt.idleClass
                  }`}
                >
                  {opt.icon}
                  <span className="truncate sm:hidden">{opt.shortLabel}</span>
                  <span className="truncate hidden sm:inline">{opt.fullLabel}</span>
                  {active && (
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${opt.dot}`} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-h-[82px] bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700 focus-within:border-blue-400 transition-colors flex">
            <textarea
              rows={2}
              maxLength={120}
              value={draftData.bio}
              onChange={(e) => setDraftData((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Write a crisp 1-2 line developer bio..."
              className="w-full h-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 font-bold leading-relaxed resize-none focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-xs sm:text-sm font-black tracking-wider text-slate-300 uppercase">
              TECH STACK
            </span>

            <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700 focus-within:border-blue-400 transition-colors flex flex-wrap items-center gap-1.5 min-h-[54px]">
              {draftData.techStack.map((tech) => (
                <span
                  key={tech}
                  className="pl-2.5 pr-1 py-1 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm font-black inline-flex items-center gap-1 shadow-sm"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(tech)}
                    className="w-4 h-4 rounded-md hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={`Remove ${tech}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {draftData.techStack.length < 8 && (
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.includes(",")) {
                      handleAddSkill(val);
                    } else {
                      setTechInput(val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill(techInput);
                    } else if (
                      e.key === "Backspace" &&
                      !techInput &&
                      draftData.techStack.length > 0
                    ) {
                      handleRemoveSkill(draftData.techStack[draftData.techStack.length - 1]);
                    }
                  }}
                  placeholder={
                    draftData.techStack.length === 0 ? "Type skill + Enter..." : "+ Add..."
                  }
                  className="flex-1 min-w-[75px] h-6 bg-transparent text-xs sm:text-sm font-black text-white placeholder-slate-500 focus:outline-none px-1"
                />
              )}
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-start gap-2 shrink-0 min-h-[48px]">
            <div className="flex items-center justify-start gap-1.5 sm:gap-2 shrink-0">
              {SOCIAL_TABS.map((tab) => {
                const isSelected = activeSocialKey === tab.key;
                const hasValue = Boolean((draftData[tab.key] || "").trim());
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setActiveSocialKey(tab.key);
                    }}
                    title={tab.label}
                    className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-blue-600/25 border-blue-400 text-blue-300 shadow-sm"
                        : "bg-slate-800 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {tab.icon}
                    {hasValue && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0f172a]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 min-w-0 flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-slate-900 border border-slate-700 focus-within:border-blue-400 transition-colors">
              <input
                type={activeSocialKey === "email" ? "email" : "text"}
                value={draftData[activeSocialKey]}
                onChange={(e) =>
                  setDraftData((prev) => ({
                    ...prev,
                    [activeSocialKey]: e.target.value,
                  }))
                }
                placeholder={activeSocialMeta.placeholder}
                className="flex-1 min-w-0 bg-transparent text-xs font-extrabold text-white placeholder-slate-500 focus:outline-none"
              />
              {draftData[activeSocialKey] && (
                <button
                  type="button"
                  onClick={() =>
                    setDraftData((prev) => ({
                      ...prev,
                      [activeSocialKey]: "",
                    }))
                  }
                  className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                  title={`Clear ${activeSocialMeta.label}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-3.5 sm:gap-4 min-h-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-base sm:text-2xl font-black text-amber-400 flex items-center gap-1.5 sm:gap-2">
                <img
                  src="/icons/streak.png"
                  alt="Streak"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                />
                {effectiveStreak}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-wider mt-1 truncate max-w-full">
                Streak
              </span>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-base sm:text-2xl font-black text-indigo-300 flex items-center gap-1.5 sm:gap-2">
                <img
                  src="/icons/vault.png"
                  alt="Bugs Fixed"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                />
                {effectiveBugs}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-wider mt-1 truncate max-w-full">
                Bugs Fixed
              </span>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-base sm:text-2xl font-black text-emerald-400 flex items-center gap-1.5 sm:gap-2">
                <img
                  src="/icons/target.png"
                  alt="Accuracy"
                  className="w-5 h-5 sm:w-7 sm:h-7 object-contain shrink-0"
                />
                {accuracyScore}%
              </span>
              <span className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-wider mt-1 truncate max-w-full">
                Accuracy
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/85 border border-slate-800 flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <img src="/icons/js-badge.png" alt="JS" className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" />
                <span className="text-xs sm:text-base font-black text-white">
                  JavaScript • {masteryScore}% Mastery
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-black text-amber-400 bg-amber-400/15 border border-amber-400/40 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified ✓
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                style={{ width: `${Math.min(100, Math.max(10, masteryScore))}%` }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between shrink-0">
              <span className="text-xs sm:text-sm font-black tracking-wider text-slate-300 uppercase">
                FEATURED PROJECTS
              </span>
              {draftData.projects.length < 2 && (
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-2.5 py-0.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-black text-sky-400 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              )}
            </div>

            {draftData.projects.length === 0 ? (
              <button
                type="button"
                onClick={handleAddProject}
                className="flex-1 rounded-2xl border-2 border-dashed border-slate-800 hover:border-sky-500/40 bg-slate-900/40 p-4 text-xs sm:text-sm font-black text-slate-300 hover:text-sky-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Featured Project</span>
              </button>
            ) : (
              <div className="flex-1 grid grid-cols-1 gap-2.5">
                {draftData.projects.slice(0, 2).map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700 focus-within:border-blue-400 flex flex-col justify-center gap-1.5 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <input
                          type="text"
                          maxLength={36}
                          value={proj.title}
                          onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                          placeholder={`Project ${idx + 1} Name`}
                          className="flex-1 min-w-0 bg-transparent text-sm sm:text-base font-black text-white placeholder-slate-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(proj.id)}
                          className="sm:hidden w-7 h-7 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-rose-400 flex items-center justify-center shrink-0 cursor-pointer"
                          title="Remove project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-1.5 px-2.5 h-8 sm:h-7 rounded-lg bg-slate-950/90 border border-slate-800 focus-within:border-sky-500/50 w-full sm:w-44">
                          <Link2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <input
                            type="text"
                            value={proj.link}
                            onChange={(e) => handleUpdateProject(proj.id, "link", e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-transparent text-xs font-extrabold text-sky-300 placeholder-slate-600 focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(proj.id)}
                          className="hidden sm:flex w-7 h-7 rounded-lg bg-slate-950/80 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 items-center justify-center shrink-0 transition-colors cursor-pointer"
                          title="Remove project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      maxLength={75}
                      value={proj.desc}
                      onChange={(e) => handleUpdateProject(proj.id, "desc", e.target.value)}
                      placeholder="Short 5-7 word description..."
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-200 placeholder-slate-500 font-bold focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t-2 border-slate-800/80 grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={cancelEditor}
              className="h-11 sm:h-12 px-3 sm:px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-white font-black text-xs sm:text-base inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="h-11 sm:h-12 px-3 sm:px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 border-b-4 border-emerald-800 text-white font-black text-xs sm:text-base inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span>{isSaving ? "Saving..." : "Save Card"}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <AppShell hideMobileHeader>
      <div className="max-w-[1140px] w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 pb-8 sm:py-6 flex flex-col gap-4 sm:gap-5">
        <div className="flex items-center justify-between gap-2 border-b-2 border-slate-800 pb-2.5 sm:pb-3">
          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("card");
              }}
              className={`px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-black flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all cursor-pointer ${
                activeTab === "card"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">Dev Card</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("setup");
              }}
              className={`px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-black flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeTab === "setup"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">Workstation</span>
              <span className="hidden md:inline-block text-[10px] font-black uppercase bg-slate-800 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
                Soon
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("projects");
              }}
              className={`px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-black flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <span className="truncate">Projects</span>
              <span className="hidden md:inline-block text-[10px] font-black uppercase bg-slate-800 text-sky-400 border border-sky-400/30 px-2 py-0.5 rounded-full">
                Soon
              </span>
            </button>
          </div>

          {saveSuccess && (
            <span className="hidden sm:flex px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-black text-xs sm:text-sm items-center gap-1.5 shrink-0 animate-in fade-in duration-200">
              <Check className="w-4 h-4" strokeWidth={2.5} />
              Saved!
            </span>
          )}
        </div>

        {activeTab === "card" && (
          <div className="w-full max-w-[1080px] mx-auto">
            {!isEditing ? (
              <DevCard
                displayName={displayName}
                username={usernameHandle}
                avatarConfig={currentUser?.avatar_config || currentUser?.avatar}
                specialtyTitle={formData.specialtyTitle}
                collabStatus={formData.collabStatus}
                bio={formData.bio}
                isSuper={isSuper}
                streakCount={effectiveStreak}
                bugsHunted={effectiveBugs}
                accuracy={accuracyScore}
                masteryPercent={masteryScore}
                techStack={formData.techStack}
                projects={formData.projects}
                socialLinks={{
                  githubUrl: formData.githubUrl,
                  linkedinUrl: formData.linkedinUrl,
                  websiteUrl: formData.websiteUrl,
                  telegramUrl: formData.telegramUrl,
                  email: formData.email,
                }}
                isMe={true}
                editButtonText="Edit Card"
                onEditInDevHub={openEditor}
              />
            ) : isSuper ? (
              <div className="relative p-[2px] rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-purple-600 via-cyan-400 to-amber-400 shadow-[0_0_35px_rgba(168,85,247,0.3)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-400 text-white font-black text-[10px] sm:text-xs tracking-widest uppercase px-3.5 sm:px-4 py-0.5 sm:py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 shrink-0 z-20 select-none">
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                  <span>SUPER MEMBER</span>
                </div>
                {editorCardBody}
              </div>
            ) : (
              editorCardBody
            )}
          </div>
        )}

        {activeTab !== "card" && (
          <div className="py-16 md:h-[510px] flex flex-col items-center justify-center text-center gap-4 bg-[#0f172a] rounded-2xl sm:rounded-3xl border-2 border-slate-700 p-6 sm:p-10 max-w-[1080px] mx-auto w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
              {activeTab === "setup" ? "⚡" : "💼"}
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white">
              {activeTab === "setup" ? "Workstation Gear" : "Portfolio Projects"}
            </h2>
            <p className="text-sm sm:text-lg font-black text-slate-300 max-w-md">
              Coming Soon
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
