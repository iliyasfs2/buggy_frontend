"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles, UserPlus, UserCheck, Eye, Flame, Bug, Zap, X } from "lucide-react";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { soundEffects } from "@/utils/soundEffects";
import type { TalentDeveloper } from "@/services/progressApi";

export interface TalentSearchTabProps {
  talents: TalentDeveloper[];
  loading: boolean;
  onOpenDevCard: (talent: TalentDeveloper) => void;
  onToggleFollow: (talent: TalentDeveloper) => void;
}

type SortOption = "streak" | "bugs" | "xp";

export function TalentSearchTab({
  talents,
  loading,
  onOpenDevCard,
  onToggleFollow,
}: TalentSearchTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyOpenToWork, setOnlyOpenToWork] = useState(false);
  const [onlyLookingForTeammate, setOnlyLookingForTeammate] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("streak");

  const filteredTalents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matched = talents.filter((t) => {
      if (q) {
        const inName = t.username.toLowerCase().includes(q) || t.display_name.toLowerCase().includes(q);
        const inRole = t.specialty_title.toLowerCase().includes(q);
        const inStack = t.tech_stack.some((tag) => tag.toLowerCase().includes(q));
        if (!inName && !inRole && !inStack) return false;
      }

      const rawStatus = (t.collab_status || "").toLowerCase();
      if (onlyOpenToWork && onlyLookingForTeammate) {
        const isOpen = rawStatus.includes("open");
        const isTeam = rawStatus.includes("team") || rawStatus.includes("looking");
        if (!isOpen && !isTeam) return false;
      } else if (onlyOpenToWork) {
        if (!rawStatus.includes("open")) return false;
      } else if (onlyLookingForTeammate) {
        if (!rawStatus.includes("team") && !rawStatus.includes("looking")) return false;
      }

      return true;
    });

    return [...matched].sort((a, b) => {
      if (a.is_super !== b.is_super) {
        return a.is_super ? -1 : 1;
      }
      if (sortBy === "streak") {
        if (b.streak !== a.streak) return b.streak - a.streak;
        return b.bugs_fixed - a.bugs_fixed;
      }
      if (sortBy === "bugs") {
        if (b.bugs_fixed !== a.bugs_fixed) return b.bugs_fixed - a.bugs_fixed;
        return b.streak - a.streak;
      }
      if (b.total_xp !== a.total_xp) return b.total_xp - a.total_xp;
      return b.streak - a.streak;
    });
  }, [talents, searchQuery, onlyOpenToWork, onlyLookingForTeammate, sortBy]);

  const getStatusBadge = (status: string) => {
    const low = (status || "").toLowerCase();
    if (low.includes("team") || low.includes("looking")) {
      return {
        label: "Looking for Teammate",
        dot: "bg-purple-400",
        style: "bg-purple-500/15 border-purple-400/40 text-purple-200",
      };
    }
    if (low.includes("learn") || low.includes("coding")) {
      return {
        label: "Focused on Learning",
        dot: "bg-amber-400",
        style: "bg-amber-500/15 border-amber-400/40 text-amber-200",
      };
    }
    return {
      label: "Open to Work",
      dot: "bg-emerald-400",
      style: "bg-emerald-500/15 border-emerald-400/40 text-emerald-200",
    };
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1080px] mx-auto">
      <div className="p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-[#0f172a] border-2 border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 shadow-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search developers..."
            className="w-full h-10 pl-10 pr-9 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs sm:text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setOnlyOpenToWork((v) => !v);
              }}
              className={`h-9 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                onlyOpenToWork
                  ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-200 shadow-sm"
                  : "bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>Open to Work</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setOnlyLookingForTeammate((v) => !v);
              }}
              className={`h-9 px-3 rounded-xl border text-xs font-black inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                onlyLookingForTeammate
                  ? "bg-purple-500/20 border-purple-400/60 text-purple-200 shadow-sm"
                  : "bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
              <span>Teammate</span>
            </button>
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-800 mx-0.5" />

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setSortBy("streak");
              }}
              className={`h-9 px-2.5 rounded-xl border text-xs font-black inline-flex items-center gap-1 transition-all cursor-pointer ${
                sortBy === "streak"
                  ? "bg-amber-500/20 border-amber-400/50 text-amber-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Streak</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setSortBy("bugs");
              }}
              className={`h-9 px-2.5 rounded-xl border text-xs font-black inline-flex items-center gap-1 transition-all cursor-pointer ${
                sortBy === "bugs"
                  ? "bg-indigo-500/20 border-indigo-400/50 text-indigo-200"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Bug className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bugs Fixed</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setSortBy("xp");
              }}
              className={`h-9 px-2.5 rounded-xl border text-xs font-black inline-flex items-center gap-1 transition-all cursor-pointer ${
                sortBy === "xp"
                  ? "bg-sky-500/20 border-sky-400/50 text-sky-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>Top XP</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl bg-[#0f172a] border-2 border-slate-800 animate-pulse p-5"
            />
          ))}
        </div>
      ) : filteredTalents.length === 0 ? (
        <div className="py-14 px-6 rounded-3xl bg-[#0f172a] border-2 border-slate-800 flex flex-col items-center justify-center text-center gap-2">
          <span className="text-lg font-black text-white">No developers found</span>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            Try clearing your search or status filters.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTalents.map((dev) => {
            const statusMeta = getStatusBadge(dev.collab_status);
            return (
              <div
                key={dev.id}
                className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 bg-[#0f172a] flex flex-col justify-between gap-3.5 relative transition-all ${
                  dev.is_super
                    ? "border-2 border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.16)]"
                    : "border-2 border-slate-800 hover:border-slate-700 shadow-lg"
                }`}
              >
                {dev.is_super && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-400 text-white text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-md border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
                    <span>SUPER</span>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
                      <AvatarRenderer config={dev.avatar_config} size={52} />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-base sm:text-lg font-black text-white truncate">
                        {dev.display_name}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-300 truncate">
                        {dev.specialty_title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`px-2.5 py-1 rounded-xl border text-[11px] font-black inline-flex items-center gap-1.5 ${statusMeta.style}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
                      <span>{statusMeta.label}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="px-2 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-xs sm:text-sm font-black text-amber-400 inline-flex items-center gap-1">
                        <img src="/icons/streak.png" alt="Streak" className="w-4 h-4 object-contain" />
                        {dev.streak}d
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase mt-0.5">
                        Streak
                      </span>
                    </div>

                    <div className="px-2 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-xs sm:text-sm font-black text-indigo-300 inline-flex items-center gap-1">
                        <img src="/icons/vault.png" alt="Fixed" className="w-4 h-4 object-contain" />
                        {dev.bugs_fixed}
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase mt-0.5">
                        Fixed
                      </span>
                    </div>

                    <div className="px-2 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
                      <span className="text-xs sm:text-sm font-black text-emerald-400 inline-flex items-center gap-1">
                        <img src="/icons/target.png" alt="Acc" className="w-4 h-4 object-contain" />
                        {dev.accuracy}%
                      </span>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase mt-0.5">
                        Acc
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 min-h-[28px]">
                    {dev.tech_stack.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] font-black"
                      >
                        {tag}
                      </span>
                    ))}
                    {dev.tech_stack.length > 3 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-black">
                        +{dev.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/90 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playSoftClick();
                      onOpenDevCard(dev);
                    }}
                    className="flex-1 h-10 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span>View Dev Card</span>
                  </button>

                  {!dev.is_me && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playSoftClick();
                        onToggleFollow(dev);
                      }}
                      className={`h-10 px-3.5 rounded-xl font-black text-xs inline-flex items-center justify-center gap-1.5 border-b-4 active:translate-y-0.5 transition-all cursor-pointer shrink-0 ${
                        dev.is_following
                          ? "bg-emerald-600/20 border border-emerald-500/50 border-b-emerald-800 text-emerald-300 hover:bg-emerald-600/30"
                          : "bg-slate-800 hover:bg-slate-700 border-slate-950 text-white"
                      }`}
                    >
                      {dev.is_following ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5 shrink-0" />
                          <span>+ Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
