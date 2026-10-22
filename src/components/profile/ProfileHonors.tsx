"use client";

import React, { useState } from "react";
import { X, ChevronRight, Lock, Check, Award, Shield } from "lucide-react";
import { soundEffects } from "@/utils/soundEffects";

export interface SpecialBadgeItem {
  id: string;
  name: string;
  enTitle: string;
  desc: string;
  ruleDesc: string;
  current: number;
  target: number;
  unit: string;
  ringColor: string;
  glowColor: string;
  accentBg: string;
  iconSvg: (isUnlocked: boolean, size?: number) => React.ReactNode;
}

export interface AchievementItem {
  id: string;
  name: string;
  enTitle: string;
  desc: string;
  ruleDesc: string;
  current: number;
  target: number;
  displayRecord: string;
  shieldGradient: string;
  glowColor: string;
  iconSvg: (isUnlocked: boolean, size?: number) => React.ReactNode;
}

interface ProfileHonorsProps {
  streak?: number;
  totalXP?: number;
  completedNodesCount?: number;
  followersCount?: number;
  currentRank?: number;
  solvedMistakesCount?: number;
}

export function ProfileHonors({
  streak = 0,
  totalXP = 0,
  completedNodesCount = 0,
  followersCount = 0,
  currentRank = 0,
  solvedMistakesCount = 0,
}: ProfileHonorsProps) {
  const [activeModal, setActiveModal] = useState<"badges_all" | "achievements_all" | null>(null);
  const [selectedHonor, setSelectedHonor] = useState<{
    type: "badge" | "achievement";
    item: SpecialBadgeItem | AchievementItem;
  } | null>(null);

  const customBadgeImages: Record<string, string> = {
    early_bird: "/badges/early-bird.png?v=5",
    night_owl: "/badges/night-owl.png?v=5",
    sniper_coder: "/badges/sniper-coder.png?v=5",
    speed_demon: "/badges/speed-demon.png?v=5",
  };

  const specialBadges: SpecialBadgeItem[] = [
    {
      id: "early_bird",
      name: "Early Bird",
      enTitle: "Early Bird",
      desc: "Solve challenges across 5 separate days before 9:00 AM.",
      ruleDesc: "Complete at least one debug challenge before 9:00 AM on 5 distinct days.",
      current: 5,
      target: 5,
      unit: "days",
      ringColor: "border-amber-400",
      glowColor: "rgba(251, 191, 36, 0.45)",
      accentBg: "from-amber-500/20 to-orange-500/10",
      iconSvg: (isUnlocked, size = 44) => (
        <img
          src="/badges/early-bird.png?v=5"
          alt="Early Bird"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "night_owl",
      name: "Night Owl",
      enTitle: "Night Owl",
      desc: "Solve challenges across 5 separate nights between 12:00 AM and 4:00 AM.",
      ruleDesc: "Solve debug challenges during late night hours (00:00 to 04:00) on 5 distinct days.",
      current: Math.min(5, Math.floor(streak / 3)),
      target: 5,
      unit: "nights",
      ringColor: "border-purple-500",
      glowColor: "rgba(168, 85, 247, 0.45)",
      accentBg: "from-purple-500/20 to-indigo-500/10",
      iconSvg: (isUnlocked, size = 44) => (
        <img
          src="/badges/night-owl.png?v=5"
          alt="Night Owl"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "sniper_coder",
      name: "Sniper Coder",
      enTitle: "Sniper Coder",
      desc: "Complete 5 consecutive challenges with 100% accuracy and zero errors.",
      ruleDesc: "Pass 5 nodes in a row on your first attempt without any test errors.",
      current: Math.min(5, Math.max(1, solvedMistakesCount > 0 ? 5 : 2)),
      target: 5,
      unit: "challenges",
      ringColor: "border-rose-500",
      glowColor: "rgba(244, 63, 94, 0.45)",
      accentBg: "from-rose-500/20 to-red-500/10",
      iconSvg: (isUnlocked, size = 44) => (
        <img
          src="/badges/sniper-coder.png?v=5"
          alt="Sniper Coder"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      enTitle: "Speed Demon",
      desc: "Complete an entire challenge in under 60 seconds with rapid coding.",
      ruleDesc: "Solve and pass any debug node or exercise in less than 60 seconds.",
      current: 1,
      target: 1,
      unit: "challenges",
      ringColor: "border-cyan-400",
      glowColor: "rgba(34, 211, 238, 0.45)",
      accentBg: "from-cyan-500/20 to-blue-500/10",
      iconSvg: (isUnlocked, size = 44) => (
        <img
          src="/badges/speed-demon.png?v=5"
          alt="Speed Demon"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "weekend_warrior",
      name: "Weekend Warrior",
      enTitle: "Weekend Warrior",
      desc: "Maintain your streak across 4 consecutive weekends without missing a day.",
      ruleDesc: "Keep your practice streak alive across 4 consecutive weekends.",
      current: Math.min(4, Math.floor(streak / 7)),
      target: 4,
      unit: "weekends",
      ringColor: "border-emerald-400",
      glowColor: "rgba(52, 211, 153, 0.45)",
      accentBg: "from-emerald-500/20 to-teal-500/10",
      iconSvg: (isUnlocked, size = 44) => (
        <svg viewBox="0 0 100 100" width={size} height={size} className={isUnlocked ? "" : "grayscale opacity-50"}>
          <circle cx="50" cy="50" r="40" fill="#064e3b" />
          <circle cx="50" cy="42" r="20" fill="#34d399" />
          <rect x="36" y="38" width="12" height="6" rx="2" fill="#022c22" />
          <rect x="52" y="38" width="12" height="6" rx="2" fill="#022c22" />
          <line x1="48" y1="41" x2="52" y2="41" stroke="#022c22" strokeWidth="2" />
          <path d="M44 54 Q50 58 56 54" stroke="#022c22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="28" y="62" width="44" height="20" rx="3" fill="#047857" stroke="#6ee7b7" strokeWidth="2" />
          <polygon points="34,70 40,73 34,76" fill="#a7f3d0" />
          <line x1="44" y1="76" x2="52" y2="76" stroke="#a7f3d0" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: "season_champion",
      name: "Season Champion",
      enTitle: "Season Champion",
      desc: "Finish in the Top 3 of a 10-day competitive leaderboard season.",
      ruleDesc: "Reach podium ranks (1st, 2nd, or 3rd) at the conclusion of a 10-day season.",
      current: currentRank > 0 && currentRank <= 3 ? 1 : 0,
      target: 1,
      unit: "podiums",
      ringColor: "border-yellow-300",
      glowColor: "rgba(253, 224, 71, 0.55)",
      accentBg: "from-yellow-500/25 to-amber-500/15",
      iconSvg: (isUnlocked, size = 44) => (
        <svg viewBox="0 0 100 100" width={size} height={size} className={isUnlocked ? "" : "grayscale opacity-50"}>
          <circle cx="50" cy="50" r="40" fill="#451a03" />
          <polygon points="26,48 34,32 50,42 66,32 74,48 26,48" fill="#facc15" stroke="#fef08a" strokeWidth="2" />
          <circle cx="34" cy="30" r="3" fill="#fef08a" />
          <circle cx="50" cy="40" r="3" fill="#fef08a" />
          <circle cx="66" cy="30" r="3" fill="#fef08a" />
          <rect x="26" y="48" width="48" height="8" rx="2" fill="#ca8a04" />
          <text x="32" y="74" fill="#fde047" fontSize="16" fontFamily="monospace" fontWeight="900">&lt;/&gt;</text>
        </svg>
      ),
    },
  ];

  const achievements: AchievementItem[] = [
    {
      id: "wildfire",
      name: "Wildfire",
      enTitle: "Wildfire",
      desc: "Reach a 30-day consecutive practice streak.",
      ruleDesc: "Keep your daily learning flame burning for 30 consecutive days.",
      current: streak,
      target: 30,
      displayRecord: "30",
      shieldGradient: "from-amber-600 via-orange-600 to-red-700",
      glowColor: "rgba(234, 88, 12, 0.45)",
      iconSvg: (isUnlocked, size = 36) => (
        <svg viewBox="0 0 100 100" width={size} height={size} className={isUnlocked ? "" : "grayscale opacity-50"}>
          <path d="M50 14 C54 28 66 36 66 50 C66 64 58 74 50 74 C42 74 34 64 34 50 C34 38 42 26 50 14 Z" fill="#ea580c" />
          <path d="M50 34 C52 42 58 46 58 54 C58 62 54 68 50 68 C46 68 42 62 42 54 C42 46 46 40 50 34 Z" fill="#fde047" />
          <rect x="26" y="72" width="48" height="12" rx="2" fill="#431407" stroke="#ea580c" strokeWidth="1.5" />
          <circle cx="34" cy="78" r="2" fill="#fdba74" />
          <circle cx="42" cy="78" r="2" fill="#fdba74" />
          <circle cx="50" cy="78" r="2" fill="#fdba74" />
          <circle cx="58" cy="78" r="2" fill="#fdba74" />
          <circle cx="66" cy="78" r="2" fill="#fdba74" />
        </svg>
      ),
    },
    {
      id: "bug_hunter",
      name: "Bug Hunter",
      enTitle: "Bug Hunter",
      desc: "Successfully debug and fix 50 coding challenges.",
      ruleDesc: "Hunt down and resolve 50 syntax or logic bugs across learning nodes.",
      current: Math.max(solvedMistakesCount, completedNodesCount * 2),
      target: 50,
      displayRecord: "50",
      shieldGradient: "from-rose-600 via-red-600 to-rose-900",
      glowColor: "rgba(225, 29, 72, 0.45)",
      iconSvg: (isUnlocked, size = 36) => (
        <svg viewBox="0 0 100 100" width={size} height={size} className={isUnlocked ? "" : "grayscale opacity-50"}>
          <ellipse cx="46" cy="52" rx="14" ry="18" fill="#be123c" />
          <circle cx="46" cy="30" r="8" fill="#881337" />
          <line x1="32" y1="44" x2="20" y2="40" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="54" x2="18" y2="54" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" />
          <line x1="32" y1="64" x2="20" y2="68" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="44" x2="72" y2="40" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="54" x2="74" y2="54" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="64" x2="72" y2="68" stroke="#fda4af" strokeWidth="3" strokeLinecap="round" />
          <circle cx="56" cy="46" r="14" stroke="#38bdf8" strokeWidth="3.5" fill="none" />
          <line x1="66" y1="56" x2="80" y2="70" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "xp_legend",
      name: "XP Legend",
      enTitle: "XP Legend",
      desc: "Accumulate over 12,500 total XP throughout your Buggy journey.",
      ruleDesc: "Earn a total of 12,500 XP through lessons, challenges, and quizzes.",
      current: totalXP,
      target: 12500,
      displayRecord: "12500",
      shieldGradient: "from-amber-500 via-yellow-500 to-amber-700",
      glowColor: "rgba(245, 158, 11, 0.5)",
      iconSvg: (isUnlocked, size = 36) => (
        <svg viewBox="0 0 100 100" width={size} height={size} className={isUnlocked ? "" : "grayscale opacity-50"}>
          <polygon points="44,14 26,48 40,48 34,82 58,42 46,42 56,14" fill="#fbbf24" stroke="#fff" strokeWidth="1" />
          <polygon points="62,22 48,50 60,50 54,78 74,44 64,44 72,22" fill="#f59e0b" />
        </svg>
      ),
    },
    {
      id: "path_conqueror",
      name: "Path Conqueror",
      enTitle: "Path Conqueror",
      desc: "Complete 15 learning path nodes across Buggy curricula.",
      ruleDesc: "Master 15 full nodes on the interactive learning roadmap.",
      current: completedNodesCount,
      target: 15,
      displayRecord: "15",
      shieldGradient: "from-blue-600 via-indigo-600 to-slate-900",
      glowColor: "rgba(59, 130, 246, 0.45)",
      iconSvg: (isUnlocked, size = 36) => (
        <svg viewBox="0 0 100 100" width={size} height={size} className={isUnlocked ? "" : "grayscale opacity-50"}>
          <polygon points="50,22 18,74 82,74" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
          <polygon points="50,22 40,42 50,46 60,42" fill="#e0f2fe" />
          <line x1="50" y1="22" x2="50" y2="8" stroke="#f1f5f9" strokeWidth="2.5" />
          <polygon points="50,8 66,14 50,20" fill="#ef4444" />
        </svg>
      ),
    },
    {
      id: "chest_collector",
      name: "Chest Collector",
      enTitle: "Chest Collector",
      desc: "Unlock 40 reward chests along learning tracks.",
      ruleDesc: "Open 40 bonus chests throughout tracks and milestone chapters.",
      current: Math.min(40, completedNodesCount + 5),
      target: 40,
      displayRecord: "40",
      shieldGradient: "from-purple-600 via-fuchsia-600 to-indigo-900",
      glowColor: "rgba(168, 85, 247, 0.45)",
      iconSvg: (isUnlocked, size = 36) => (
        <svg viewBox="0 0 100 100" width={size} height={size} className={isUnlocked ? "" : "grayscale opacity-50"}>
          <path d="M22 42 C22 34 34 30 50 30 C66 30 78 34 78 42 Z" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />
          <rect x="22" y="42" width="56" height="32" rx="3" fill="#7e22ce" stroke="#fef08a" strokeWidth="2" />
          <rect x="46" y="44" width="8" height="14" rx="2" fill="#facc15" />
          <circle cx="50" cy="50" r="2" fill="#0f172a" />
          <line x1="22" y1="52" x2="78" y2="52" stroke="#facc15" strokeWidth="2" />
        </svg>
      ),
    },
    {
      id: "network_star",
      name: "Network Star",
      enTitle: "Network Star",
      desc: "Connect with 10 fellow coders in your developer network.",
      ruleDesc: "Follow and build connections to reach 10 active coder followers.",
      current: followersCount,
      target: 10,
      displayRecord: "10",
      shieldGradient: "from-cyan-600 via-teal-600 to-slate-900",
      glowColor: "rgba(20, 184, 166, 0.45)",
      iconSvg: (isUnlocked, size = 36) => (
        <svg viewBox="0 0 100 100" width={size} height={size} className={isUnlocked ? "" : "grayscale opacity-50"}>
          <circle cx="34" cy="38" r="10" fill="#2dd4bf" />
          <circle cx="66" cy="38" r="10" fill="#38bdf8" />
          <path d="M22 64 C22 52 46 52 46 64" fill="#14b8a6" />
          <path d="M54 64 C54 52 78 52 78 64" fill="#0284c7" />
          <path d="M42 66 L50 72 L58 66" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      ),
    },
  ];

  const sortedBadges = [...specialBadges].sort((a, b) => {
    const aUnlocked = a.current >= a.target ? 1 : 0;
    const bUnlocked = b.current >= b.target ? 1 : 0;
    return bUnlocked - aUnlocked;
  });

  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = a.current >= a.target ? 1 : 0;
    const bUnlocked = b.current >= b.target ? 1 : 0;
    return bUnlocked - aUnlocked;
  });

  const previewBadges = sortedBadges.slice(0, 4);
  const previewAchievements = sortedAchievements.slice(0, 4);

  return (
    <div className="w-full flex flex-col gap-12 sm:gap-16 select-none mt-4">
      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-black text-slate-200 uppercase tracking-wider">
            Special Badges
          </h2>

          <button
            type="button"
            onClick={() => {
              soundEffects.playSoftClick();
              setActiveModal("badges_all");
            }}
            className="inline-flex items-center gap-1 text-xs font-black text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer py-1 px-1.5"
            title="View all badges"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-4 md:gap-5 items-center justify-items-center py-1">
          {previewBadges.map((badge) => {
            const isUnlocked = badge.current >= badge.target;
            const customImg = customBadgeImages[badge.id];
            return (
              <div
                key={badge.id}
                onClick={() => {
                  soundEffects.playSoftClick();
                  setSelectedHonor({ type: "badge", item: badge });
                }}
                className="flex flex-col items-center justify-center cursor-pointer group w-full"
                title={`${badge.name} • ${isUnlocked ? "Unlocked" : "In Progress"}`}
              >
                <div
                  className={`rounded-full flex items-center justify-center relative transition-transform group-hover:scale-105 ${
                    customImg
                      ? "w-full max-w-[82px] min-[390px]:max-w-[88px] min-[414px]:max-w-[94px] sm:max-w-[110px] md:max-w-[130px] aspect-square"
                      : `w-full max-w-[72px] sm:max-w-[86px] aspect-square border-4 ${
                          isUnlocked
                            ? `${badge.ringColor} bg-[#0b1426]`
                            : "border-slate-800 bg-slate-950/80 opacity-70"
                        }`
                  }`}
                >
                  {customImg ? (
                    <img
                      src={customImg}
                      alt={badge.name}
                      className={`w-full h-full object-contain transition-all ${
                        isUnlocked ? "" : "grayscale opacity-50"
                      }`}
                    />
                  ) : (
                    badge.iconSvg(isUnlocked, 48)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-black text-slate-200 uppercase tracking-wider">
            Achievements
          </h2>

          <button
            type="button"
            onClick={() => {
              soundEffects.playSoftClick();
              setActiveModal("achievements_all");
            }}
            className="inline-flex items-center gap-1 text-xs font-black text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer py-1 px-1.5"
            title="View all achievements"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-4 md:gap-5 items-center justify-items-center py-1">
          {previewAchievements.map((ach) => {
            const isUnlocked = ach.current >= ach.target;
            return (
              <div
                key={ach.id}
                onClick={() => {
                  soundEffects.playSoftClick();
                  setSelectedHonor({ type: "achievement", item: ach });
                }}
                className="flex flex-col items-center justify-center cursor-pointer group w-full"
                title={`${ach.name} • ${isUnlocked ? "Unlocked" : "In Progress"}`}
              >
                <div
                  className={`w-full max-w-[70px] min-[390px]:max-w-[76px] sm:max-w-[84px] aspect-[68/76] sm:aspect-[84/92] relative flex flex-col items-center justify-between pt-2 pb-1.5 transition-transform group-hover:scale-105 ${
                    isUnlocked ? "opacity-100" : "opacity-65"
                  }`}
                >
                  <svg
                    viewBox="0 0 76 84"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    <defs>
                      <linearGradient id={`shield-grad-${ach.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isUnlocked ? "#38bdf8" : "#334155"} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={isUnlocked ? "#0f172a" : "#020617"} stopOpacity="0.95" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M38 2 L72 12 C72 50 56 74 38 82 C20 74 4 50 4 12 Z"
                      fill={`url(#shield-grad-${ach.id})`}
                      stroke={isUnlocked ? "#38bdf8" : "#475569"}
                      strokeWidth="2.5"
                    />
                  </svg>

                  <div className="relative z-10 mt-1">
                    {ach.iconSvg(isUnlocked, 38)}
                  </div>

                  <span className="relative z-10 text-[11px] sm:text-xs font-black text-white font-mono leading-none mb-1">
                    {ach.displayRecord}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] md:bg-black/60 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full min-h-screen md:min-h-0 md:max-w-[640px] md:rounded-3xl md:border-2 md:border-b-4 md:border-slate-700 md:border-b-slate-800 bg-[#0f172a] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-slate-800/90 flex items-center justify-between gap-3 bg-[#0b1528] shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                {activeModal === "badges_all" ? (
                  <Award className="w-5 h-5 text-amber-400" />
                ) : (
                  <Shield className="w-5 h-5 text-rose-400" />
                )}
                <h3 className="text-base sm:text-lg font-black text-white">
                  {activeModal === "badges_all" ? "Special Badges (6 Total)" : "Achievements (6 Total)"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveModal(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              {activeModal === "badges_all" ? (
                specialBadges.map((badge) => {
                  const isUnlocked = badge.current >= badge.target;
                  const percent = Math.min(100, Math.round((badge.current / badge.target) * 100));

                  return (
                    <div
                      key={badge.id}
                      onClick={() => {
                        soundEffects.playSoftClick();
                        setSelectedHonor({ type: "badge", item: badge });
                      }}
                      className="p-3.5 sm:p-4 rounded-2xl bg-[#0b1426] border border-slate-800 hover:border-slate-700 flex items-center gap-3.5 cursor-pointer transition-colors"
                    >
                      <div
                        className={`rounded-full flex items-center justify-center shrink-0 ${
                          customBadgeImages[badge.id]
                            ? "w-24 h-24"
                            : `w-14 h-14 border-2 ${
                                isUnlocked ? `${badge.ringColor} bg-slate-950` : "border-slate-700 bg-slate-950 opacity-60"
                              }`
                        }`}
                      >
                        {customBadgeImages[badge.id] ? (
                          <img
                            src={customBadgeImages[badge.id]}
                            alt={badge.name}
                            className={`w-full h-full object-contain ${
                              isUnlocked ? "" : "grayscale opacity-50"
                            }`}
                          />
                        ) : (
                          badge.iconSvg(isUnlocked, 38)
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm sm:text-base font-black text-white truncate">
                            {badge.name}
                          </span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isUnlocked
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/50"
                                : "bg-slate-900 text-slate-400 border border-slate-700"
                            }`}
                          >
                            {isUnlocked ? "✓ Unlocked" : "🔒 In Progress"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 font-medium line-clamp-1">
                          {badge.desc}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">
                            {badge.current} / {badge.target}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                achievements.map((ach) => {
                  const isUnlocked = ach.current >= ach.target;
                  const percent = Math.min(100, Math.round((ach.current / ach.target) * 100));

                  return (
                    <div
                      key={ach.id}
                      onClick={() => {
                        soundEffects.playSoftClick();
                        setSelectedHonor({ type: "achievement", item: ach });
                      }}
                      className="p-3.5 sm:p-4 rounded-2xl bg-[#0b1426] border border-slate-800 hover:border-slate-700 flex items-center gap-3.5 cursor-pointer transition-colors"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        {ach.iconSvg(isUnlocked, 36)}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-sm sm:text-base font-black text-white truncate">
                              {ach.name}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-400">
                              (Goal: {ach.displayRecord})
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              isUnlocked
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/50"
                                : "bg-slate-900 text-slate-400 border border-slate-700"
                            }`}
                          >
                            {isUnlocked ? "✓ Unlocked" : "🔒 In Progress"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 font-medium line-clamp-1">
                          {ach.desc}
                        </p>

                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">
                            {ach.current.toLocaleString()} / {ach.target.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {selectedHonor && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-[#0f172a] md:bg-black/60 md:backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedHonor(null)}
        >
          <div
            className="w-full min-h-screen md:min-h-0 md:max-w-md md:rounded-[28px] md:border-2 md:border-b-4 md:border-slate-700 md:border-b-slate-800 bg-[#0f172a] flex flex-col overflow-hidden shadow-2xl p-6 sm:p-7 relative animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                soundEffects.playSoftClick();
                setSelectedHonor(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-4">
              <div
                className={`flex items-center justify-center relative mb-5 ${
                  customBadgeImages[selectedHonor.item.id]
                    ? "w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]"
                    : "w-[150px] h-[150px] rounded-3xl bg-slate-950 border-2 border-slate-800"
                }`}
              >
                {customBadgeImages[selectedHonor.item.id] ? (
                  <img
                    src={customBadgeImages[selectedHonor.item.id]}
                    alt={selectedHonor.item.name}
                    className={`w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] object-contain transition-all ${
                      selectedHonor.item.current >= selectedHonor.item.target
                        ? ""
                        : "grayscale opacity-50"
                    }`}
                  />
                ) : (
                  selectedHonor.item.iconSvg(
                    selectedHonor.item.current >= selectedHonor.item.target,
                    100
                  )
                )}
              </div>

              <h3 className="text-2xl font-black text-white leading-tight mb-2">
                {selectedHonor.item.name}
              </h3>

              <div className="mb-4">
                {selectedHonor.item.current >= selectedHonor.item.target ? (
                  <span className="h-7 px-3.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/50 text-xs font-black inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>✓ Unlocked</span>
                  </span>
                ) : (
                  <span className="h-7 px-3.5 rounded-full bg-amber-950/70 text-amber-400 border border-amber-500/50 text-xs font-black inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>🔒 In Progress</span>
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-medium px-2 mb-6 text-center">
                {selectedHonor.item.ruleDesc}
              </p>

              <div className="w-full p-4 rounded-2xl bg-[#091122] border border-slate-800 flex flex-col gap-2.5 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Your Progress:</span>
                  <span className="font-mono text-amber-400 font-black">
                    {selectedHonor.item.current.toLocaleString()} of {selectedHonor.item.target.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((selectedHonor.item.current / selectedHonor.item.target) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setSelectedHonor(null);
                }}
                className="w-full h-12 rounded-2xl bg-cyan-600 hover:bg-cyan-500 active:translate-y-1 active:border-b-2 border-2 border-b-4 border-cyan-400 border-b-cyan-800 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
              >
                Close &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
