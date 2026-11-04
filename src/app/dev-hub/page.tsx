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
  CheckCircle2,
  Flame,
  Bug,
  Target,
  ShieldCheck,
  Sparkles,
  Link2,
  Trash2,
  Lock
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

const ROLE_PRESETS = [
  { short: "Full-Stack", full: "Full-Stack Developer" },
  { short: "Frontend", full: "Frontend Developer" },
  { short: "Backend", full: "Backend Engineer" },
  { short: "AI / ML", full: "AI / ML Engineer" },
];

const STATUS_OPTIONS = [
  {
    value: "Open to Work",
    shortLabel: "Open to Work",
    dot: "bg-emerald-400",
    activeClass: "bg-emerald-500/15 border-emerald-400/60 text-emerald-300 shadow-sm shadow-emerald-500/10",
    idleClass: "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700",
  },
  {
    value: "Looking for Teammate",
    shortLabel: "Teammate",
    dot: "bg-purple-400",
    activeClass: "bg-purple-500/15 border-purple-400/60 text-purple-300 shadow-sm shadow-purple-500/10",
    idleClass: "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700",
  },
  {
    value: "Learning & Coding",
    shortLabel: "Learning",
    dot: "bg-amber-400",
    activeClass: "bg-amber-500/15 border-amber-400/60 text-amber-300 shadow-sm shadow-amber-500/10",
    idleClass: "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700",
  },
];

const POPULAR_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "FastAPI",
  "Tailwind",
  "Docker",
  "SQL",
  "Git",
  "GraphQL",
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

  const suggestedSkills = POPULAR_SKILLS.filter(
    (item) => !draftData.techStack.some((s) => s.toLowerCase() === item.toLowerCase())
  ).slice(0, 4);

  const activeSocialMeta = SOCIAL_TABS.find((t) => t.key === activeSocialKey) || SOCIAL_TABS[0];

  const editorCardBody = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        commitSave();
      }}
      className={`bg-[#0f172a] rounded-3xl p-6 sm:p-8 lg:p-9 md:min-h-[540px] flex flex-col justify-between relative transition-all animate-in fade-in duration-150 ${
        isSuper
          ? ""
          : "border-2 border-blue-500/60 shadow-[0_0_35px_rgba(37,99,235,0.18)]"
      }`}
    >
      <div className="flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-8 lg:gap-10 flex-1">
        <div className="md:col-span-5 flex flex-col justify-between gap-5 md:border-r-2 md:border-slate-800/90 md:pr-8 lg:pr-10">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full border-2 border-blue-500/40 bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
                <AvatarRenderer config={currentUser?.avatar_config || currentUser?.avatar} size={72} />
              </div>
              <div className="flex flex-col min-w-0 flex-1 gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                    {displayName}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-black uppercase tracking-wider text-blue-300 shrink-0">
                    Editing
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={40}
                  value={draftData.specialtyTitle}
                  onChange={(e) =>
                    setDraftData((prev) => ({ ...prev, specialtyTitle: e.target.value }))
                  }
                  placeholder="Role title (e.g. Full-Stack Developer)"
                  className="w-full h-10 px-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-400 text-sm sm:text-base font-extrabold text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {ROLE_PRESETS.map((preset) => {
                const isSelected = draftData.specialtyTitle === preset.full;
                return (
                  <button
                    key={preset.short}
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setDraftData((prev) => ({ ...prev, specialtyTitle: preset.full }));
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                        : "bg-slate-900/70 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    {preset.short}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2">
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
                    className={`h-10 px-2.5 rounded-xl border text-xs sm:text-sm font-black inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer truncate ${
                      active ? opt.activeClass : opt.idleClass
                    }`}
                  >
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      {active && (
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${opt.dot}`}
                        />
                      )}
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${opt.dot}`} />
                    </span>
                    <span className="truncate">{opt.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/80 focus-within:border-blue-400 transition-colors flex flex-col gap-1.5">
              <textarea
                rows={2}
                maxLength={120}
                value={draftData.bio}
                onChange={(e) => setDraftData((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Write a crisp 1-2 line developer bio..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 font-bold leading-relaxed resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400">Short Bio</span>
                <span
                  className={`text-xs font-black font-mono ${
                    draftData.bio.length >= 110 ? "text-amber-400" : "text-slate-400"
                  }`}
                >
                  {draftData.bio.length}/120
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black tracking-wider text-slate-300 uppercase">
                  TECH STACK
                </span>
                <span className="text-xs font-black font-mono text-slate-400">
                  {draftData.techStack.length}/8
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 focus-within:border-blue-400 transition-colors flex flex-wrap items-center gap-2 min-h-[48px]">
                {draftData.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="pl-3 pr-1.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm font-black inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(tech)}
                      className="w-5 h-5 rounded-md hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label={`Remove ${tech}`}
                    >
                      <X className="w-3.5 h-3.5" />
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
                      draftData.techStack.length === 0 ? "Type skill + Enter..." : "+ Add skill..."
                    }
                    className="flex-1 min-w-[100px] h-7 bg-transparent text-xs sm:text-sm font-black text-white placeholder-slate-500 focus:outline-none px-1"
                  />
                )}
              </div>

              {suggestedSkills.length > 0 && draftData.techStack.length < 8 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {suggestedSkills.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleAddSkill(sug)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-black text-slate-300 hover:text-sky-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3.5 border-t-2 border-slate-800/80 flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm sm:text-base font-black text-slate-400 truncate">
                  @{usernameHandle}
                </span>
                <div className="flex items-center gap-1.5">
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
                        className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-600/20 border-blue-400 text-blue-300 shadow-sm"
                            : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                        }`}
                      >
                        {tab.icon}
                        {hasValue && (
                          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0f172a]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2.5 h-10 px-3 rounded-xl bg-slate-900/90 border border-slate-700/80 focus-within:border-blue-400 transition-colors">
                <span className="text-xs font-black uppercase tracking-wider text-blue-400 shrink-0">
                  {activeSocialMeta.label}
                </span>
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
                  className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm font-extrabold text-white placeholder-slate-500 focus:outline-none"
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
                    className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title={`Clear ${activeSocialMeta.label}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 opacity-95">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black tracking-wider text-sky-400 uppercase flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" strokeWidth={2.5} />
                  VERIFIED BY BUGGY
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-300" />
                  Auto-Synced
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1.5">
                    <Flame className="w-5 h-5 fill-amber-400" />
                    {effectiveStreak}
                  </span>
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wider mt-1">
                    Streak
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
                  <span className="text-xl sm:text-2xl font-black text-rose-400 flex items-center gap-1.5">
                    <Bug className="w-5 h-5" />
                    {effectiveBugs}
                  </span>
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wider mt-1">
                    Bugs Fixed
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-1.5">
                    <Target className="w-5 h-5" />
                    {accuracyScore}%
                  </span>
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wider mt-1">
                    Accuracy
                  </span>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img src="/icons/js-badge.png" alt="JS" className="w-6 h-6 object-contain" />
                    <span className="text-sm sm:text-base font-black text-white">
                      JavaScript • {masteryScore}% Mastery
                    </span>
                  </div>
                  <span className="text-xs font-black text-amber-400 bg-amber-400/15 border border-amber-400/40 px-2.5 py-1 rounded-full inline-flex items-center gap-1 shrink-0">
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
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-black tracking-wider text-slate-300 uppercase">
                  FEATURED PROJECTS ({draftData.projects.length}/2)
                </span>
                {draftData.projects.length < 2 && (
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-3 py-1 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-black text-sky-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              {draftData.projects.length === 0 ? (
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="p-5 rounded-2xl border-2 border-dashed border-slate-800 hover:border-sky-500/40 bg-slate-900/40 text-sm font-black text-slate-300 hover:text-sky-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add a Featured Project to showcase on your Card</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {draftData.projects.slice(0, 2).map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 focus-within:border-blue-400 flex flex-col gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={36}
                          value={proj.title}
                          onChange={(e) => handleUpdateProject(proj.id, "title", e.target.value)}
                          placeholder={`Project ${idx + 1} Name`}
                          className="flex-1 min-w-0 bg-transparent text-sm sm:text-base font-black text-white placeholder-slate-500 focus:outline-none"
                        />
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-slate-800 focus-within:border-sky-500/50 w-40 sm:w-52 shrink-0">
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
                          className="w-8 h-8 rounded-xl bg-slate-950/80 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                          title="Remove project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
          </div>

          <div className="flex items-center gap-3 pt-4 border-t-2 border-slate-800/80">
            <button
              type="button"
              onClick={cancelEditor}
              className="flex-1 h-12 sm:h-[52px] px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-white font-black text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Cancel</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-900/90 text-xs font-mono text-slate-300 border border-slate-700">
                Esc
              </span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 h-12 sm:h-[52px] px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 border-b-4 border-emerald-800 text-white font-black text-sm sm:text-base inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{isSaving ? "Saving..." : "Save Card"}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <AppShell hideMobileHeader>
      <div className="max-w-[1180px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-7 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center p-2 shadow-inner">
              <img src="/icons/setup.png" alt="Dev Hub" className="w-7 h-7 object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Dev Hub</h1>
          </div>

          {saveSuccess && (
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-black text-xs sm:text-sm flex items-center gap-1.5 shrink-0 animate-in fade-in duration-200">
              <Check className="w-4 h-4" strokeWidth={2.5} />
              Card Saved!
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-b-2 border-slate-800 pb-3 overflow-x-auto">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("card");
              }}
              className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-black flex items-center gap-2.5 transition-all cursor-pointer shrink-0 ${
                activeTab === "card"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Dev Card</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("setup");
              }}
              className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-black flex items-center gap-2.5 transition-all cursor-pointer shrink-0 ${
                activeTab === "setup"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Workstation</span>
              <span className="text-[10px] sm:text-xs font-black uppercase bg-slate-800 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">
                Soon
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("projects");
              }}
              className={`px-5 py-2.5 rounded-2xl text-sm sm:text-base font-black flex items-center gap-2.5 transition-all cursor-pointer shrink-0 ${
                activeTab === "projects"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FolderGit2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Projects</span>
              <span className="text-[10px] sm:text-xs font-black uppercase bg-slate-800 text-sky-400 border border-sky-400/30 px-2 py-0.5 rounded-full">
                Soon
              </span>
            </button>
          </div>
        </div>

        {activeTab === "card" && (
          <div className="w-full max-w-[1120px] mx-auto pt-1">
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
              <div className="relative p-[2px] rounded-3xl bg-gradient-to-tr from-purple-600 via-cyan-400 to-amber-400 shadow-[0_0_35px_rgba(168,85,247,0.3)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-400 text-white font-black text-xs tracking-widest uppercase px-4 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 shrink-0 z-20 select-none">
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
          <div className="py-24 md:min-h-[540px] flex flex-col items-center justify-center text-center gap-5 bg-[#0f172a] rounded-3xl border-2 border-slate-700 p-10 max-w-[1120px] mx-auto w-full">
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-4xl shadow-inner">
              {activeTab === "setup" ? "⚡" : "💼"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {activeTab === "setup" ? "Workstation Gear" : "Portfolio Projects"}
            </h2>
            <p className="text-base sm:text-lg font-black text-slate-300 max-w-md">
              Coming Soon
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
