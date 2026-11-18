"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import type { DevProjectItem } from "@/components/profile/DevCard";
import {
  Users,
  Trophy,
  Plus,
  ArrowRight,
  ExternalLink,
  Heart,
  Crown,
  Trash2,
  X,
  Eye,
  Copy,
  Check,
  Send,
  Linkedin,
  Mail,
  Link2,
  Handshake,
  Flame,
  Briefcase,
  Rocket,
} from "lucide-react";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { soundEffects } from "@/utils/soundEffects";
import type {
  SquadRequestItem,
  CreateSquadPayload,
  ShowcaseProjectItem,
  TalentDeveloper,
} from "@/services/progressApi";

export interface SquadsShowcaseTabProps {
  squads: SquadRequestItem[];
  projects: ShowcaseProjectItem[];
  userDevProjects?: DevProjectItem[];
  currentUsername?: string;
  loading: boolean;
  defaultContactLink?: string;
  onCreateSquad: (payload: CreateSquadPayload) => Promise<void>;
  onDeleteSquad: (squadId: number) => Promise<void>;
  onToggleBoost: (projectId: number) => Promise<void>;
  onOpenDevCard: (talent: TalentDeveloper) => void;
  onSubmitYourProject: () => void;
}

const VIBE_OPTIONS = [
  {
    value: "Fun Side Project",
    label: "Fun Side Project",
    icon: <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
    activeClass: "bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm",
    badgeClass: "bg-amber-500/15 border-amber-400/40 text-amber-300",
  },
  {
    value: "Portfolio Builder",
    label: "Portfolio Builder",
    icon: <Briefcase className="w-3.5 h-3.5 text-sky-400 shrink-0" />,
    activeClass: "bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm",
    badgeClass: "bg-sky-500/15 border-sky-400/40 text-sky-300",
  },
  {
    value: "Serious / Startup",
    label: "Serious / Startup",
    icon: <Trophy className="w-3.5 h-3.5 text-purple-400 shrink-0" />,
    activeClass: "bg-purple-500/20 border-purple-400 text-purple-200 shadow-sm",
    badgeClass: "bg-purple-500/15 border-purple-400/40 text-purple-300",
  },
];

const INTRO_MESSAGE_TEXT =
  "Hey! I saw your squad post on Buggy. Let's build this project together!";

function normalizeContactHref(raw: string): string {
  const val = (raw || "").trim();
  if (!val) return "";
  if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("mailto:")) {
    return val;
  }
  if (val.includes("@") && val.includes(".") && !val.startsWith("@")) {
    return `mailto:${val}`;
  }
  if (val.startsWith("@")) {
    return `https://t.me/${val.slice(1)}`;
  }
  return `https://${val}`;
}

export function SquadsShowcaseTab({
  squads,
  projects,
  userDevProjects = [],
  currentUsername = "",
  defaultContactLink = "",
  onCreateSquad,
  onDeleteSquad,
  onToggleBoost,
  onOpenDevCard,
  onSubmitYourProject,
}: SquadsShowcaseTabProps) {
  const [subTab, setSubTab] = useState<"squads" | "showcase">("squads");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectVibe, setProjectVibe] = useState("Portfolio Builder");
  const [myRole, setMyRole] = useState("");
  const [neededRole, setNeededRole] = useState("");
  const [minStreak, setMinStreak] = useState(7);
  const [contactLink, setContactLink] = useState(defaultContactLink);
  const [description, setDescription] = useState("");
  const [submittingSquad, setSubmittingSquad] = useState(false);
  const [boostingIds, setBoostingIds] = useState<Record<number, boolean>>({});
  const [activeConnectSquad, setActiveConnectSquad] = useState<SquadRequestItem | null>(null);
  const [copiedIntro, setCopiedIntro] = useState(false);
  const [highlightedProjectId, setHighlightedProjectId] = useState<number | null>(null);
  const projectCardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myResolvedProjects = useMemo(() => {
    const validCardProjects = (userDevProjects || []).filter(
      (p) => p && typeof p.title === "string" && p.title.trim().length > 0
    );
    if (validCardProjects.length === 0) return [];

    const cleanUser = (currentUsername || "").trim().toLowerCase();
    return validCardProjects.slice(0, 2).map((cardProj) => {
      const targetTitle = cardProj.title.trim().toLowerCase();
      const matched =
        projects.find(
          (sp) =>
            sp.title.trim().toLowerCase() === targetTitle &&
            (sp.creator?.is_me ||
              (cleanUser && sp.creator_username.trim().toLowerCase() === cleanUser))
        ) ||
        projects.find((sp) => sp.title.trim().toLowerCase() === targetTitle);

      return {
        key: cardProj.id || cardProj.title,
        title: cardProj.title.trim(),
        showcaseId: matched ? matched.id : null,
        boostCount: matched ? matched.boost_count : 0,
      };
    });
  }, [userDevProjects, projects, currentUsername]);

  const handleScrollToMyProject = (showcaseId: number | null) => {
    soundEffects.playSoftClick();
    if (showcaseId === null) return;
    const node = projectCardRefs.current[showcaseId];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setHighlightedProjectId(showcaseId);
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedProjectId(null);
    }, 2400);
  };

  useEffect(() => {
    if (defaultContactLink && !contactLink) {
      setContactLink(defaultContactLink);
    }
  }, [defaultContactLink, contactLink]);

  const handleOpenPostModal = () => {
    soundEffects.playSoftClick();
    if (!contactLink && defaultContactLink) {
      setContactLink(defaultContactLink);
    }
    setIsPostModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !myRole.trim() || !neededRole.trim() || submittingSquad) return;
    soundEffects.playSoftClick();
    setSubmittingSquad(true);
    try {
      await onCreateSquad({
        project_title: projectTitle.trim(),
        project_vibe: projectVibe,
        my_role: myRole.trim(),
        needed_role: neededRole.trim(),
        min_streak: Number(minStreak) || 0,
        contact_link: contactLink.trim(),
        description:
          description.trim() || "Looking for a motivated teammate to build and ship together.",
      });
      setProjectTitle("");
      setMyRole("");
      setNeededRole("");
      setDescription("");
      setMinStreak(7);
      setIsPostModalOpen(false);
    } finally {
      setSubmittingSquad(false);
    }
  };

  const handleBoostClick = async (projectId: number) => {
    if (boostingIds[projectId]) return;
    soundEffects.playSoftClick();
    setBoostingIds((prev) => ({ ...prev, [projectId]: true }));
    try {
      await onToggleBoost(projectId);
    } finally {
      setBoostingIds((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const handleCopyIntroMessage = async () => {
    soundEffects.playSoftClick();
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(INTRO_MESSAGE_TEXT);
      }
    } catch {}
    setCopiedIntro(true);
    setTimeout(() => setCopiedIntro(false), 2200);
  };

  const getVibeMeta = (vibe?: string) => {
    return (
      VIBE_OPTIONS.find((v) => v.value.toLowerCase() === (vibe || "").toLowerCase()) ||
      VIBE_OPTIONS[1]
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1080px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a] border-2 border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 shadow-lg">
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundEffects.playSoftClick();
              setSubTab("squads");
            }}
            className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-black inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === "squads"
                ? "bg-purple-600 text-white shadow-md shadow-purple-950/50"
                : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Find a Squad</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playSoftClick();
              setSubTab("showcase");
            }}
            className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-black inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
              subTab === "showcase"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40"
                : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Project Showcase</span>
          </button>
        </div>

        {subTab === "squads" && (
          <button
            type="button"
            onClick={handleOpenPostModal}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 border-b-4 border-emerald-800 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Post Team Request</span>
          </button>
        )}
      </div>

      {subTab === "squads" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {squads.map((sq) => {
            const vibeMeta = getVibeMeta(sq.project_vibe);
            return (
              <div
                key={sq.id}
                className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0f172a] border-2 border-slate-800 hover:border-slate-700 flex flex-col justify-between gap-3.5 shadow-lg transition-colors"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                        <AvatarRenderer config={sq.creator.avatar_config} size={42} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm sm:text-base font-black text-white break-words leading-snug">
                          {sq.creator_username}
                        </span>
                        <span className="text-xs font-bold text-slate-400 break-words leading-snug">
                          {sq.creator.specialty_title}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-black inline-flex items-center gap-1">
                        <img
                          src="/icons/streak.png"
                          alt="Streak"
                          className="w-3.5 h-3.5 object-contain"
                        />
                        {sq.creator.streak}d
                      </span>
                      {sq.is_mine && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playSoftClick();
                            onDeleteSquad(sq.id);
                          }}
                          title="Delete request"
                          className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug break-words">
                      {sq.project_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-black inline-flex items-center gap-1.5 ${vibeMeta.badgeClass}`}
                      >
                        {vibeMeta.icon}
                        <span>{vibeMeta.label}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 inline-flex items-center gap-2 text-xs font-black">
                      <span className="text-sky-300">Have: {sq.my_role}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-purple-300">Need: {sq.needed_role}</span>
                    </div>

                    {sq.min_streak > 0 && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] font-black text-amber-300 inline-flex items-center gap-1">
                        <img
                          src="/icons/streak.png"
                          alt="Min Streak"
                          className="w-3.5 h-3.5 object-contain"
                        />
                        <span>{sq.min_streak}d+ Streak</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-300 leading-relaxed break-words">
                    {sq.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      setCopiedIntro(false);
                      setActiveConnectSquad(sq);
                    }}
                    className="w-full sm:w-auto h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Handshake className="w-4 h-4 shrink-0" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {myResolvedProjects.length === 0 ? (
            <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-[#0f172a] border-2 border-blue-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <span className="text-sm sm:text-base font-black text-white break-words">
                Want to compete in this season&apos;s showcase?
              </span>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  onSubmitYourProject();
                }}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Submit Your Project</span>
              </button>
            </div>
          ) : (
            <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#0f172a] border-2 border-slate-800 flex flex-wrap items-center gap-2 sm:gap-2.5 shadow-lg">
              <span className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider mr-1">
                My Projects:
              </span>
              {myResolvedProjects.map((mp) => {
                const isHighlighted =
                  mp.showcaseId !== null && highlightedProjectId === mp.showcaseId;
                return (
                  <button
                    key={mp.key}
                    type="button"
                    onClick={() => handleScrollToMyProject(mp.showcaseId)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-black inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                      isHighlighted
                        ? "bg-sky-500/25 border-sky-400 text-sky-200 ring-2 ring-sky-400/50"
                        : "bg-slate-900 hover:bg-slate-800 border-slate-700 text-white hover:border-sky-500/50"
                    }`}
                  >
                    <Rocket className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="break-words">{mp.title}</span>
                    <span className="text-sky-400">• {mp.boostCount} Boosts</span>
                  </button>
                );
              })}
            </div>
          )}

          {projects.map((proj, index) => {
            const isFirst = index === 0;
            const isHighlighted = highlightedProjectId === proj.id;
            return (
              <div
                key={proj.id}
                ref={(el) => {
                  projectCardRefs.current[proj.id] = el;
                }}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative transition-all duration-300 ${
                  isHighlighted
                    ? "border-2 border-sky-400 ring-2 ring-sky-400 shadow-[0_0_28px_rgba(56,189,248,0.28)]"
                    : isFirst
                    ? "border-2 border-amber-400/70 bg-gradient-to-r from-amber-500/10 via-[#0f172a] to-[#0f172a] shadow-[0_0_28px_rgba(245,158,11,0.16)]"
                    : "border-2 border-slate-800 hover:border-slate-700 shadow-lg"
                }`}
              >
                <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {isFirst ? (
                      <span className="px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>#1 Project of the Season</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-black">
                        #{index + 1}
                      </span>
                    )}

                    <h3 className="text-base sm:text-xl font-black text-white break-words leading-snug">
                      {proj.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-300 leading-relaxed break-words">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playSoftClick();
                        onOpenDevCard(proj.creator);
                      }}
                      className="inline-flex items-center gap-2 pr-2.5 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors cursor-pointer"
                    >
                      <div className="w-6 h-6 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center">
                        <AvatarRenderer config={proj.creator.avatar_config} size={22} />
                      </div>
                      <span className="text-xs font-black text-slate-200">
                        {proj.creator_username}
                      </span>
                    </button>

                    {proj.tech_tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] font-black"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-col md:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundEffects.playSoftClick()}
                      className="h-11 px-3.5 sm:px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    </a>
                  )}

                  <button
                    type="button"
                    disabled={Boolean(boostingIds[proj.id])}
                    onClick={() => handleBoostClick(proj.id)}
                    className={`h-11 px-3.5 sm:px-4 rounded-2xl font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 border-b-4 active:translate-y-0.5 transition-all cursor-pointer ${
                      proj.has_boosted
                        ? "bg-rose-600 hover:bg-rose-500 border-rose-800 text-white shadow-md"
                        : "bg-slate-800 hover:bg-slate-700 border-slate-950 text-white shadow-md"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 shrink-0 ${
                        proj.has_boosted ? "fill-white text-white" : "text-rose-400"
                      }`}
                    />
                    <span>Like ({proj.boost_count})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isPostModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={() => setIsPostModalOpen(false)}
        >
          <form
            onSubmit={handleCreateSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0f172a] border-2 border-b-4 border-slate-700 border-b-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 my-auto animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-black text-white">Post Team Request</h4>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-300 uppercase">Project Title</label>
              <input
                type="text"
                required
                maxLength={60}
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Realtime AI Code Reviewer"
                className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-400 text-sm font-bold text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-300 uppercase">Project Vibe</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {VIBE_OPTIONS.map((vibe) => {
                  const active = projectVibe === vibe.value;
                  return (
                    <button
                      key={vibe.value}
                      type="button"
                      onClick={() => {
                        soundEffects.playSoftClick();
                        setProjectVibe(vibe.value);
                      }}
                      className={`h-10 px-3 rounded-xl border text-xs font-black inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        active
                          ? vibe.activeClass
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <span>{vibe.icon}</span>
                      <span>{vibe.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-300 uppercase">My Role (Have)</label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={myRole}
                  onChange={(e) => setMyRole(e.target.value)}
                  placeholder="e.g. Frontend"
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-400 text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-300 uppercase">Needed Role</label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={neededRole}
                  onChange={(e) => setNeededRole(e.target.value)}
                  placeholder="e.g. Backend"
                  className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-400 text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-black text-slate-300 uppercase">
                  Min Streak Required
                </label>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black inline-flex items-center gap-1">
                  <img
                    src="/icons/streak.png"
                    alt="Streak"
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>
                    {minStreak === 0
                      ? "Any Streak"
                      : `${minStreak}${minStreak >= 30 ? "+" : ""}d+ Streak`}
                  </span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={minStreak}
                onChange={(e) => setMinStreak(Number(e.target.value) || 0)}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-950 rounded-lg"
              />
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500">
                <span>0d (Anyone)</span>
                <span>7d</span>
                <span>14d</span>
                <span>30d+</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-300 uppercase">
                Contact Link / Handle
              </label>
              <input
                type="text"
                maxLength={140}
                value={contactLink}
                onChange={(e) => setContactLink(e.target.value)}
                placeholder="https://t.me/username or LinkedIn URL"
                className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-400 text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-300 uppercase">
                Short Description
              </label>
              <textarea
                rows={2}
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you building and what teammate skills do you need?"
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-400 text-sm font-bold text-white placeholder-slate-500 resize-none focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsPostModalOpen(false)}
                className="h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 border-b-4 border-slate-950 text-white font-black text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingSquad}
                className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 text-white font-black text-xs sm:text-sm cursor-pointer disabled:opacity-60"
              >
                {submittingSquad ? "Posting..." : "Post Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeConnectSquad && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setActiveConnectSquad(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0f172a] border-2 border-b-4 border-slate-700 border-b-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Handshake className="w-5 h-5 text-sky-400" />
                <h4 className="text-lg font-black text-white">Connect &amp; Join Squad</h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveConnectSquad(null)}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                <AvatarRenderer config={activeConnectSquad.creator.avatar_config} size={46} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-base font-black text-white break-words leading-snug">
                  {activeConnectSquad.creator_username}
                </span>
                <span className="text-xs font-bold text-slate-400 break-words leading-snug">
                  {activeConnectSquad.creator.specialty_title}
                </span>
                <span className="text-xs font-black text-sky-300 mt-0.5 break-words leading-snug">
                  Project: {activeConnectSquad.project_title}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-black text-slate-300 uppercase">
                Quick Intro Message
              </span>
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col gap-3">
                <p className="text-xs sm:text-sm font-bold text-slate-200 leading-relaxed select-all">
                  &ldquo;{INTRO_MESSAGE_TEXT}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={handleCopyIntroMessage}
                  className={`h-10 px-4 rounded-xl font-black text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    copiedIntro
                      ? "bg-emerald-500/20 border border-emerald-400/50 text-emerald-300"
                      : "bg-blue-600 hover:bg-blue-500 border-b-4 border-blue-800 text-white"
                  }`}
                >
                  {copiedIntro ? (
                    <>
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Copied Intro Message!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 shrink-0" />
                      <span>Copy Intro Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-black text-slate-300 uppercase">
                Direct Contact Channels
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeConnectSquad.contact_link && (
                  <a
                    href={normalizeContactHref(activeConnectSquad.contact_link)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundEffects.playSoftClick()}
                    className="h-10 px-3.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 font-black text-xs inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <Link2 className="w-4 h-4 shrink-0" />
                    <span>Direct Contact Link</span>
                  </a>
                )}

                {activeConnectSquad.creator.social_links?.telegramUrl && (
                  <a
                    href={normalizeContactHref(activeConnectSquad.creator.social_links.telegramUrl)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundEffects.playSoftClick()}
                    className="h-10 px-3.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 font-black text-xs inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Open Telegram</span>
                  </a>
                )}

                {activeConnectSquad.creator.social_links?.linkedinUrl && (
                  <a
                    href={normalizeContactHref(activeConnectSquad.creator.social_links.linkedinUrl)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundEffects.playSoftClick()}
                    className="h-10 px-3.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 font-black text-xs inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 shrink-0" />
                    <span>Open LinkedIn</span>
                  </a>
                )}

                {activeConnectSquad.creator.social_links?.email && (
                  <a
                    href={`mailto:${activeConnectSquad.creator.social_links.email}`}
                    onClick={() => soundEffects.playSoftClick()}
                    className="h-10 px-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-black text-xs inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Send Email</span>
                  </a>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  const creator = activeConnectSquad.creator;
                  setActiveConnectSquad(null);
                  onOpenDevCard(creator);
                }}
                className="text-xs sm:text-sm font-black text-slate-300 hover:text-white inline-flex items-center gap-1.5 py-1 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>View Creator&apos;s Full Dev Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
