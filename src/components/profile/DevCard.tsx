"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Send,
  Edit3,
  Share2,
  Copy,
  Check,
  Mail,
  Flame,
  Bug,
  Target,
  Sparkles
} from "lucide-react";
import type { AvatarConfig } from "@/services/authApi";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { soundEffects } from "@/utils/soundEffects";

export interface DevProjectItem {
  id: string;
  title: string;
  desc: string;
  link: string;
}

export interface DevCardProps {
  displayName: string;
  username: string;
  avatarConfig?: AvatarConfig | null;
  specialtyTitle?: string;
  collabStatus?: string;
  bio?: string;
  isSuper?: boolean;
  streakCount?: number;
  bugsHunted?: number;
  accuracy?: number;
  masteryPercent?: number;
  techStack?: string[];
  projects?: DevProjectItem[];
  socialLinks?: {
    githubUrl?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    telegramUrl?: string;
    email?: string;
  };
  isMe?: boolean;
  editButtonText?: string;
  onEditInDevHub?: () => void;
  onShareCard?: () => void;
  className?: string;
  cardRef?: React.Ref<HTMLDivElement>;
}

export function DevCard({
  displayName,
  username,
  avatarConfig,
  specialtyTitle = "Full-Stack Developer",
  collabStatus = "Open to Work",
  bio = "Building interactive web apps with React & FastAPI.",
  isSuper = false,
  streakCount = 42,
  bugsHunted = 128,
  accuracy = 89,
  masteryPercent = 85,
  techStack = ["JavaScript", "React", "TypeScript", "Python", "FastAPI"],
  projects = [
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
  ],
  socialLinks = {
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    websiteUrl: "https://buggy.dev",
    telegramUrl: "https://t.me",
    email: "coder@buggy.dev",
  },
  isMe = true,
  editButtonText = "Edit in Dev Hub",
  onEditInDevHub,
  onShareCard,
  className = "",
  cardRef,
}: DevCardProps) {
  const [copied, setCopied] = useState(false);

  const getCollabStatusMeta = (status: string) => {
    const raw = (status || "").toLowerCase();
    if (raw.includes("team") || raw.includes("looking")) {
      return {
        label: "Looking for Teammate",
        dotColor: "bg-purple-400",
        pingColor: "bg-purple-400",
        pillBg: "bg-purple-500/10",
        border: "border-purple-500/30",
        text: "text-purple-300",
      };
    }
    if (raw.includes("learn") || raw.includes("coding")) {
      return {
        label: "Learning & Coding",
        dotColor: "bg-amber-400",
        pingColor: "bg-amber-400",
        pillBg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-300",
      };
    }
    return {
      label: "Open to Work",
      dotColor: "bg-emerald-400",
      pingColor: "bg-emerald-400",
      pillBg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
    };
  };

  const statusMeta = getCollabStatusMeta(collabStatus);

  const handleShareClick = async () => {
    soundEffects.playSoftClick();
    if (onShareCard) {
      onShareCard();
      return;
    }
    try {
      const shareUrl = typeof window !== "undefined" ? window.location.href : "";
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const cardContent = (
    <div
      ref={cardRef}
      className={`bg-[#0f172a] rounded-3xl p-5 sm:p-6 flex flex-col gap-5 select-none relative ${
        isSuper ? "" : "border-2 border-slate-700 shadow-2xl"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-16 h-16 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
            <AvatarRenderer config={avatarConfig} size={58} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
              {displayName}
            </h3>
            <span className="text-xs sm:text-sm font-semibold text-slate-400 truncate mt-0.5">
              {specialtyTitle}
            </span>
          </div>
        </div>

        <div className="self-start sm:self-center shrink-0">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.pillBg} ${statusMeta.border} ${statusMeta.text} shadow-sm`}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusMeta.pingColor}`}
              />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${statusMeta.dotColor}`} />
            </span>
            <span>{statusMeta.label}</span>
          </div>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
        <p className="line-clamp-2">{bio}</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black tracking-wider text-sky-400 uppercase flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
            VERIFIED BY BUGGY
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-base sm:text-lg font-black text-amber-400 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-400" />
              {streakCount}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
              Streak
            </span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-base sm:text-lg font-black text-rose-400 flex items-center gap-1">
              <Bug className="w-4 h-4" />
              {bugsHunted}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
              Bugs Fixed
            </span>
          </div>

          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-base sm:text-lg font-black text-emerald-400 flex items-center gap-1">
              <Target className="w-4 h-4" />
              {accuracy}%
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
              Accuracy
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/icons/js-badge.png"
                alt="JS"
                className="w-5 h-5 object-contain"
              />
              <span className="text-xs sm:text-sm font-black text-white">
                JavaScript • {masteryPercent}% Mastery
              </span>
            </div>
            <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified ✓
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(10, masteryPercent))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase">
          TECH STACK
        </span>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-bold shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {projects && projects.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase">
            FEATURED PROJECTS
          </span>
          <div className="flex flex-col gap-2">
            {projects.slice(0, 2).map((proj) => (
              <div
                key={proj.id}
                className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {proj.title}
                  </span>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-normal truncate">
                  {proj.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-500">@{username}</span>
          <div className="flex items-center gap-2">
            {socialLinks.githubUrl && (
              <a
                href={socialLinks.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {socialLinks.linkedinUrl && (
              <a
                href={socialLinks.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socialLinks.telegramUrl ? (
              <a
                href={socialLinks.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Telegram"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
            ) : socialLinks.websiteUrl ? (
              <a
                href={socialLinks.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            ) : null}
            {socialLinks.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          {isMe ? (
            <>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  if (onEditInDevHub) onEditInDevHub();
                }}
                className="flex-1 h-11 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>{editButtonText}</span>
              </button>

              <button
                type="button"
                onClick={handleShareClick}
                className="flex-1 h-11 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-slate-200 hover:text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Card</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleShareClick}
              className="w-full h-11 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Card Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Card Link</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (isSuper) {
    return (
      <div
        className={`relative p-[2px] rounded-3xl bg-gradient-to-tr from-purple-600 via-cyan-400 to-amber-400 shadow-[0_0_35px_rgba(168,85,247,0.3)] ${className}`}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-400 text-white font-black text-[10px] tracking-widest uppercase px-3.5 py-0.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1 shrink-0 z-20 select-none">
          <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
          <span>SUPER MEMBER</span>
        </div>
        {cardContent}
      </div>
    );
  }

  return <div className={`relative ${className}`}>{cardContent}</div>;
}
