"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
      className={`bg-[#0f172a] rounded-3xl p-5 sm:p-6 select-none relative ${
        isSuper ? "" : "border-2 border-slate-700 shadow-2xl"
      }`}
    >
      <div className="flex flex-col gap-5 md:grid md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5 flex flex-col justify-between gap-4 md:border-r md:border-slate-800/80 md:pr-6">
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-16 h-16 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
                <AvatarRenderer config={avatarConfig} size={58} />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-xl font-black text-white leading-tight truncate">
                  {displayName}
                </h3>
                <span className="text-xs sm:text-sm font-semibold text-slate-400 truncate mt-0.5">
                  {specialtyTitle}
                </span>
              </div>
            </div>

            <div>
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

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
              <p className="line-clamp-2">{bio}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
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

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 truncate pr-2">@{username}</span>
              <div className="flex items-center gap-1.5 shrink-0">
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
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black tracking-wider text-sky-400 uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                VERIFIED BY BUGGY
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                  <span className="text-base sm:text-lg font-black text-amber-400 flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    {streakCount}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
                    Streak
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                  <span className="text-base sm:text-lg font-black text-rose-400 flex items-center gap-1">
                    <Bug className="w-4 h-4" />
                    {bugsHunted}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
                    Bugs Fixed
                  </span>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                  <span className="text-base sm:text-lg font-black text-emerald-400 flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {accuracy}%
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-0.5">
                    Accuracy
                  </span>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col gap-1.5 shadow-sm">
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

            {projects && projects.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase">
                  FEATURED PROJECTS
                </span>
                <div className="flex flex-col gap-2">
                  {projects.slice(0, 2).map((proj) => (
                    <div
                      key={proj.id}
                      className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col gap-0.5 transition-colors"
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
          </div>

          <div
            data-export-ignore="true"
            className="flex items-center gap-2.5 pt-2 border-t border-slate-800/80"
          >
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
                  onClick={handleOpenShareModal}
                  className="flex-1 h-11 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-slate-200 hover:text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-sky-400" />
                  <span>Share Card</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleOpenShareModal}
                className="w-full h-11 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
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
          <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase">
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
                <span className="text-[10px] font-black tracking-tight truncate max-w-full">
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
              <span className="text-[10px] font-black tracking-tight truncate max-w-full">
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
          className={`relative p-[2px] rounded-3xl bg-gradient-to-tr from-purple-600 via-cyan-400 to-amber-400 shadow-[0_0_35px_rgba(168,85,247,0.3)] ${className}`}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-400 text-white font-black text-[10px] tracking-widest uppercase px-3.5 py-0.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1 shrink-0 z-20 select-none">
            <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
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
