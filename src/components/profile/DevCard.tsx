"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ShieldCheck,
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
  Sparkles,
  Download,
  X,
  MessageCircle
} from "lucide-react";
import { toPng } from "html-to-image";
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
  className = "",
  cardRef,
}: DevCardProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const internalRef = useRef<HTMLDivElement | null>(null);

  const setMergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof cardRef === "function") {
        cardRef(node);
      } else if (cardRef && typeof cardRef === "object") {
        (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [cardRef]
  );

  useEffect(() => {
    if (!isShareOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsShareOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc, true);
    return () => window.removeEventListener("keydown", handleEsc, true);
  }, [isShareOpen]);

  const getCollabStatusMeta = (status: string) => {
    const raw = (status || "").toLowerCase();
    if (raw.includes("team") || raw.includes("looking")) {
      return {
        label: "Looking for Teammate",
        dotColor: "bg-purple-400",
        pingColor: "bg-purple-400",
        pillBg: "bg-purple-500/15",
        border: "border-purple-500/40",
        text: "text-purple-300",
      };
    }
    if (raw.includes("learn") || raw.includes("coding")) {
      return {
        label: "Learning & Coding",
        dotColor: "bg-amber-400",
        pingColor: "bg-amber-400",
        pillBg: "bg-amber-500/15",
        border: "border-amber-500/40",
        text: "text-amber-300",
      };
    }
    return {
      label: "Open to Work",
      dotColor: "bg-emerald-400",
      pingColor: "bg-emerald-400",
      pillBg: "bg-emerald-500/15",
      border: "border-emerald-500/40",
      text: "text-emerald-400",
    };
  };

  const statusMeta = getCollabStatusMeta(collabStatus);

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const cleanHandle = (username || "me").replace(/^@/, "");
    return `${window.location.origin}/profile/${encodeURIComponent(cleanHandle)}?card=open`;
  };

  const shareText = `Check out ${displayName}'s (${specialtyTitle}) verified Developer Card on Buggy!`;

  const handleOpenShareModal = () => {
    soundEffects.playSoftClick();
    setIsShareOpen(true);
  };

  const handleCopyShareLink = async () => {
    soundEffects.playSoftClick();
    const url = getShareUrl();
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownloadImage = async () => {
    if (!internalRef.current) return;
    soundEffects.playSoftClick();
    setIsExporting(true);
    try {
      const dataUrl = await toPng(internalRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0f172a",
        filter: (node) => {
          if (node instanceof HTMLElement && node.dataset.exportIgnore === "true") {
            return false;
          }
          return true;
        },
      });
      const link = document.createElement("a");
      link.download = `${(username || "developer").replace(/^@/, "")}-buggy-card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    soundEffects.playSoftClick();
    const url = getShareUrl();
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} — Buggy Dev Card`,
          text: shareText,
          url,
        });
        return;
      } catch {}
    }
    await handleCopyShareLink();
  };

  const shareUrl = getShareUrl();
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialPlatforms = [
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      colorClass: "bg-sky-500/15 border-sky-500/30 text-sky-400 hover:bg-sky-500/25",
      icon: <Send className="w-5 h-5" />,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      colorClass: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      id: "x",
      label: "X / Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      colorClass: "bg-slate-700/40 border-slate-600 text-white hover:bg-slate-700/70",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      colorClass: "bg-blue-600/15 border-blue-500/30 text-blue-400 hover:bg-blue-600/25",
      icon: <Linkedin className="w-5 h-5" />,
    },
    {
      id: "reddit",
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
      colorClass: "bg-orange-500/15 border-orange-500/30 text-orange-400 hover:bg-orange-500/25",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      colorClass: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/25",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: "email",
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(`${displayName} — Buggy Dev Card`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      colorClass: "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25",
      icon: <Mail className="w-5 h-5" />,
    },
  ];

  const cardContent = (
    <div
      ref={setMergedRef}
      className={`bg-[#0f172a] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 select-none relative h-auto md:h-[510px] flex flex-col ${
        isSuper ? "" : "border-2 border-slate-700 shadow-2xl"
      }`}
    >
      <div className="flex flex-col gap-5 md:grid md:grid-cols-12 md:gap-7 lg:gap-9 flex-1 min-h-0">
        <div className="md:col-span-5 flex flex-col gap-3.5 sm:gap-4 md:border-r-2 md:border-slate-800/90 md:pr-7 lg:pr-9 min-h-0">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 shrink-0">
            <div className="w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
              <AvatarRenderer config={avatarConfig} size={70} />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                {displayName}
              </h3>
              <div className="h-7 sm:h-8 flex items-center">
                <span className="text-sm sm:text-base font-extrabold text-slate-300 truncate">
                  {specialtyTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className={`h-9 sm:h-10 inline-flex items-center gap-2.5 px-4 rounded-xl text-xs sm:text-sm font-black border ${statusMeta.pillBg} ${statusMeta.border} ${statusMeta.text} shadow-sm`}
            >
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusMeta.pingColor}`}
                />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusMeta.dotColor}`} />
              </span>
              <span>{statusMeta.label}</span>
            </div>
          </div>

          <div className="flex-1 min-h-[82px] text-sm sm:text-base text-slate-200 leading-relaxed font-bold bg-slate-900/80 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex items-center">
            <p className="line-clamp-3">{bio}</p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-xs sm:text-sm font-black tracking-wider text-slate-300 uppercase">
              TECH STACK
            </span>
            <div className="p-3 rounded-2xl bg-slate-900/75 border border-slate-800 flex flex-wrap items-center gap-2 min-h-[54px]">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700/80 text-white text-xs sm:text-sm font-black shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t-2 border-slate-800/80 flex items-center justify-between gap-2 shrink-0 min-h-[44px]">
            <span className="text-sm sm:text-base font-black text-slate-400 truncate pr-2">
              @{username}
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {socialLinks.githubUrl && (
                <a
                  href={socialLinks.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {socialLinks.linkedinUrl && (
                <a
                  href={socialLinks.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {socialLinks.telegramUrl ? (
                <a
                  href={socialLinks.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              ) : socialLinks.websiteUrl ? (
                <a
                  href={socialLinks.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                  title="Website"
                >
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ) : null}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition-colors"
                  title="Email"
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-3.5 sm:gap-4 min-h-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-base sm:text-2xl font-black text-amber-400 flex items-center gap-1.5 sm:gap-2">
                <img
                  src="/icons/streak.png"
                  alt="Streak"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                />
                {streakCount}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-wider mt-1 truncate max-w-full">
                Streak
              </span>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-base sm:text-2xl font-black text-indigo-300 flex items-center gap-1.5 sm:gap-2">
                <img
                  src="/icons/vault.png"
                  alt="Bugs Fixed"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                />
                {bugsHunted}
              </span>
              <span className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-wider mt-1 truncate max-w-full">
                Bugs Fixed
              </span>
            </div>

            <div className="p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-base sm:text-2xl font-black text-emerald-400 flex items-center gap-1.5 sm:gap-2">
                <img
                  src="/icons/target.png"
                  alt="Accuracy"
                  className="w-5 h-5 sm:w-7 sm:h-7 object-contain shrink-0"
                />
                {accuracy}%
              </span>
              <span className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-wider mt-1 truncate max-w-full">
                Accuracy
              </span>
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/85 border border-slate-800 flex flex-col gap-2 shadow-sm shrink-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <img
                  src="/icons/js-badge.png"
                  alt="JS"
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                />
                <span className="text-xs sm:text-base font-black text-white">
                  JavaScript • {masteryPercent}% Mastery
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
                style={{ width: `${Math.min(100, Math.max(10, masteryPercent))}%` }}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <span className="text-xs sm:text-sm font-black tracking-wider text-slate-300 uppercase shrink-0">
              FEATURED PROJECTS
            </span>
            {projects && projects.length > 0 ? (
              <div className="flex-1 grid grid-cols-1 gap-2.5">
                {projects.slice(0, 2).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/85 border border-slate-800 flex flex-col justify-center gap-1 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm sm:text-base font-black text-white truncate">
                        {proj.title}
                      </span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs sm:text-sm font-black text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 shrink-0 transition-colors"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 font-bold line-clamp-2 sm:truncate">
                      {proj.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-center p-4 text-xs sm:text-sm font-bold text-slate-400">
                No featured projects added yet.
              </div>
            )}
          </div>

          <div
            data-export-ignore="true"
            className="pt-3 border-t-2 border-slate-800/80 shrink-0"
          >
            {isMe ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    if (onEditInDevHub) onEditInDevHub();
                  }}
                  className="h-11 sm:h-12 px-3 sm:px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs sm:text-base inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span className="truncate">{editButtonText}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenShareModal}
                  className="h-11 sm:h-12 px-3 sm:px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-white font-black text-xs sm:text-base inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
                  <span className="truncate">Share Card</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenShareModal}
                className="w-full h-11 sm:h-12 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs sm:text-base inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>Share Card</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const shareModal = isShareOpen ? (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        e.stopPropagation();
        setIsShareOpen(false);
      }}
    >
      <div
        className="w-full max-w-md bg-[#0c162c] border-2 border-b-4 border-slate-700 border-b-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-400" />
            <h4 className="text-lg font-black text-white tracking-wide">Share Dev Card</h4>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEffects.playSoftClick();
              setIsShareOpen(false);
            }}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="w-full h-12 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:translate-y-0.5 border-b-4 border-amber-700 text-slate-950 font-black text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
          >
            <Download className="w-4 h-4" strokeWidth={2.5} />
            <span>{isExporting ? "Generating Image..." : "Download Card Image (PNG)"}</span>
          </button>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/90 border border-slate-800">
            <span className="flex-1 text-xs font-bold text-slate-400 truncate px-2.5 select-all">
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyShareLink}
              className={`h-9 px-3.5 rounded-xl font-black text-xs inline-flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                copied
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-black tracking-wider text-slate-300 uppercase">
            Share to Social Media
          </span>
          <div className="grid grid-cols-4 gap-2">
            {socialPlatforms.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundEffects.playSoftClick()}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${item.colorClass}`}
              >
                <div className="w-7 h-7 flex items-center justify-center">{item.icon}</div>
                <span className="text-[10px] sm:text-[11px] font-black tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </a>
            ))}

            <button
              type="button"
              onClick={handleNativeShare}
              className="p-2.5 rounded-2xl border bg-purple-500/15 border-purple-500/30 text-purple-300 hover:bg-purple-500/25 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black tracking-tight truncate max-w-full">
                More Apps
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  if (isSuper) {
    return (
      <>
        <div
          className={`relative p-[2px] rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-purple-600 via-cyan-400 to-amber-400 shadow-[0_0_35px_rgba(168,85,247,0.3)] ${className}`}
        >
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-400 text-white font-black text-[10px] sm:text-xs tracking-widest uppercase px-3.5 sm:px-4 py-0.5 sm:py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 shrink-0 z-20 select-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
            <span>SUPER MEMBER</span>
          </div>
          {cardContent}
        </div>
        {shareModal}
      </>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>{cardContent}</div>
      {shareModal}
    </>
  );
}
