"use client";

import React, { useState } from "react";
import {
  Users,
  Trophy,
  Plus,
  ArrowRight,
  ExternalLink,
  Rocket,
  Crown,
  Trash2,
  X,
  Eye,
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
  loading: boolean;
  onCreateSquad: (payload: CreateSquadPayload) => Promise<void>;
  onDeleteSquad: (squadId: number) => Promise<void>;
  onToggleBoost: (projectId: number) => Promise<void>;
  onOpenDevCard: (talent: TalentDeveloper) => void;
}

const ROLE_CHOICES = ["Frontend", "Backend", "Full-Stack", "UI/UX", "Mobile", "AI / Data"];

export function SquadsShowcaseTab({
  squads,
  projects,
  loading,
  onCreateSquad,
  onDeleteSquad,
  onToggleBoost,
  onOpenDevCard,
}: SquadsShowcaseTabProps) {
  const [subTab, setSubTab] = useState<"squads" | "showcase">("squads");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [myRole, setMyRole] = useState("Frontend");
  const [neededRole, setNeededRole] = useState("Backend");
  const [minStreak, setMinStreak] = useState(3);
  const [description, setDescription] = useState("");
  const [submittingSquad, setSubmittingSquad] = useState(false);
  const [boostingIds, setBoostingIds] = useState<Record<number, boolean>>({});

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || submittingSquad) return;
    soundEffects.playSoftClick();
    setSubmittingSquad(true);
    try {
      await onCreateSquad({
        project_title: projectTitle.trim(),
        my_role: myRole,
        needed_role: neededRole,
        min_streak: Number(minStreak) || 0,
        description: description.trim() || "Looking for a motivated teammate to build and ship together.",
      });
      setProjectTitle("");
      setDescription("");
      setMinStreak(3);
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
            onClick={() => {
              soundEffects.playSoftClick();
              setIsPostModalOpen(true);
            }}
            className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 border-b-4 border-emerald-800 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>+ Post Team Request</span>
          </button>
        )}
      </div>

      {subTab === "squads" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {squads.map((sq) => (
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
                      <span className="text-sm sm:text-base font-black text-white truncate">
                        {sq.creator_username}
                      </span>
                      <span className="text-xs font-bold text-slate-400 truncate">
                        {sq.creator.specialty_title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-black inline-flex items-center gap-1">
                      <img src="/icons/streak.png" alt="Streak" className="w-3.5 h-3.5 object-contain" />
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

                <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                  {sq.project_title}
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 inline-flex items-center gap-2 text-xs font-black">
                    <span className="text-sky-300">Have: {sq.my_role}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-purple-300">Need: {sq.needed_role}</span>
                  </div>

                  {sq.min_streak > 0 && (
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-black text-slate-300">
                      Min Streak: {sq.min_streak}d
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-300 leading-relaxed line-clamp-2">
                  {sq.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playSoftClick();
                    onOpenDevCard(sq.creator);
                  }}
                  className="w-full sm:w-auto h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:translate-y-0.5 border-b-4 border-blue-800 text-white font-black text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span>Connect / View Card</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {projects.map((proj, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={proj.id}
                className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#0f172a] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative transition-all ${
                  isFirst
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

                    <h3 className="text-base sm:text-xl font-black text-white truncate">
                      {proj.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-300 leading-relaxed">
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

                <div className="flex sm:flex-col md:flex-row items-center gap-2.5 shrink-0">
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => soundEffects.playSoftClick()}
                      className="h-11 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-0.5 border-b-4 border-slate-950 text-white font-black text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    </a>
                  )}

                  <button
                    type="button"
                    disabled={Boolean(boostingIds[proj.id])}
                    onClick={() => handleBoostClick(proj.id)}
                    className={`h-11 px-4 rounded-2xl font-black text-xs sm:text-sm inline-flex items-center justify-center gap-2 border-b-4 active:translate-y-0.5 transition-all cursor-pointer ${
                      proj.has_boosted
                        ? "bg-amber-500 hover:bg-amber-400 border-amber-700 text-slate-950 shadow-md"
                        : "bg-blue-600 hover:bg-blue-500 border-blue-800 text-white shadow-md"
                    }`}
                  >
                    <Rocket className="w-4 h-4 shrink-0" />
                    <span>Byte Boost ({proj.boost_count})</span>
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
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsPostModalOpen(false)}
        >
          <form
            onSubmit={handleCreateSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0f172a] border-2 border-b-4 border-slate-700 border-b-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-150"
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

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-300 uppercase">My Role (Have)</label>
                <select
                  value={myRole}
                  onChange={(e) => setMyRole(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm font-black text-white focus:outline-none"
                >
                  {ROLE_CHOICES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-300 uppercase">Needed Role</label>
                <select
                  value={neededRole}
                  onChange={(e) => setNeededRole(e.target.value)}
                  className="h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm font-black text-white focus:outline-none"
                >
                  {ROLE_CHOICES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-300 uppercase">
                Minimum Streak (Days)
              </label>
              <input
                type="number"
                min={0}
                max={365}
                value={minStreak}
                onChange={(e) => setMinStreak(Number(e.target.value) || 0)}
                className="h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-400 text-sm font-bold text-white focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-slate-300 uppercase">
                Short Description
              </label>
              <textarea
                rows={3}
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you building and what teammate skills do you need?"
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-400 text-sm font-bold text-white placeholder-slate-500 resize-none focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
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
    </div>
  );
}
