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
    weekend_warrior: "/badges/weekend-warrior.png?v=5",
    season_champion: "/badges/season-champion.png?v=5",
  };

  const customAchievementImages: Record<string, string> = {
    wildfire: "/achievements/wildfire.png?v=1",
    bug_hunter: "/achievements/bug-hunter.png?v=1",
    xp_legend: "/achievements/xp-legend.png?v=1",
    path_conqueror: "/achievements/path-conqueror.png?v=1",
  };

  const specialBadges: SpecialBadgeItem[] = [
    {
      id: "weekend_warrior",
      name: "Weekend Warrior",
      enTitle: "Weekend Warrior",
      desc: "4 weekends streak",
      ruleDesc: "Maintain your practice streak across 4 consecutive weekends.",
      current: Math.min(4, Math.floor(streak / 7 * 2) || (streak >= 2 ? 1 : 0)),
      target: 4,
      unit: "weekends",
      ringColor: "border-emerald-400",
      glowColor: "rgba(52, 211, 153, 0.45)",
      accentBg: "from-emerald-500/20 to-teal-500/10",
      iconSvg: (isUnlocked, size = 44) => (
        <img
          src="/badges/weekend-warrior.png?v=5"
          alt="Weekend Warrior"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "season_champion",
      name: "Season Champion",
      enTitle: "Season Champion",
      desc: "Top 3 season rank",
      ruleDesc: "Reach podium ranks (1st, 2nd, or 3rd) in a competitive season.",
      current: currentRank > 0 && currentRank <= 3 ? 1 : 0,
      target: 1,
      unit: "podiums",
      ringColor: "border-yellow-300",
      glowColor: "rgba(253, 224, 71, 0.55)",
      accentBg: "from-yellow-500/25 to-amber-500/15",
      iconSvg: (isUnlocked, size = 44) => (
        <img
          src="/badges/season-champion.png?v=5"
          alt="Season Champion"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "sniper_coder",
      name: "Sniper Coder",
      enTitle: "Sniper Coder",
      desc: "5 flawless challenges",
      ruleDesc: "Pass 5 challenges with 100% first-try accuracy.",
      current: Math.min(5, Math.max(0, solvedMistakesCount > 0 ? 5 : 2)),
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
      desc: "Challenge under 60s",
      ruleDesc: "Complete any challenge in under 60 seconds.",
      current: completedNodesCount >= 1 ? 1 : 0,
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
      id: "early_bird",
      name: "Early Bird",
      enTitle: "Early Bird",
      desc: "5 days before 9 AM",
      ruleDesc: "Solve challenges before 9:00 AM on 5 distinct days.",
      current: Math.min(5, Math.max(0, Math.floor(streak / 2))),
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
      desc: "5 late night sessions",
      ruleDesc: "Solve challenges between 12:00 AM and 4:00 AM on 5 nights.",
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
  ];

  const achievements: AchievementItem[] = [
    {
      id: "wildfire",
      name: "Wildfire",
      enTitle: "Wildfire",
      desc: "30-day streak",
      ruleDesc: "Maintain a 30-day consecutive practice streak.",
      current: streak,
      target: 30,
      displayRecord: "30",
      shieldGradient: "from-amber-600 via-orange-600 to-red-700",
      glowColor: "rgba(234, 88, 12, 0.45)",
      iconSvg: (isUnlocked, size = 36) => (
        <img
          src="/achievements/wildfire.png?v=1"
          alt="Wildfire"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "bug_hunter",
      name: "Bug Hunter",
      enTitle: "Bug Hunter",
      desc: "50 bugs resolved",
      ruleDesc: "Successfully resolve 50 coding challenges in the debug section.",
      current: solvedMistakesCount,
      target: 50,
      displayRecord: "50",
      shieldGradient: "from-rose-600 via-red-600 to-rose-900",
      glowColor: "rgba(225, 29, 72, 0.45)",
      iconSvg: (isUnlocked, size = 36) => (
        <img
          src="/achievements/bug-hunter.png?v=1"
          alt="Bug Hunter"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "xp_legend",
      name: "XP Legend",
      enTitle: "XP Legend",
      desc: "12,500 Total XP",
      ruleDesc: "Surpass 12,500 total XP earned across Buggy.",
      current: totalXP,
      target: 12500,
      displayRecord: "12500",
      shieldGradient: "from-amber-500 via-yellow-500 to-amber-700",
      glowColor: "rgba(245, 158, 11, 0.5)",
      iconSvg: (isUnlocked, size = 36) => (
        <img
          src="/achievements/xp-legend.png?v=1"
          alt="XP Legend"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "path_conqueror",
      name: "Path Conqueror",
      enTitle: "Path Conqueror",
      desc: "15 roadmap nodes",
      ruleDesc: "Complete 15 learning path nodes across Buggy curricula.",
      current: completedNodesCount,
      target: 15,
      displayRecord: "15",
      shieldGradient: "from-blue-600 via-indigo-600 to-slate-900",
      glowColor: "rgba(59, 130, 246, 0.45)",
      iconSvg: (isUnlocked, size = 36) => (
        <img
          src="/achievements/path-conqueror.png?v=1"
          alt="Path Conqueror"
          style={{ width: size, height: size }}
          className={`object-contain transition-all ${isUnlocked ? "" : "grayscale opacity-50"}`}
        />
      ),
    },
    {
      id: "chest_collector",
      name: "Chest Collector",
      enTitle: "Chest Collector",
      desc: "40 chests opened",
      ruleDesc: "Unlock 40 reward chests along learning tracks.",
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
      desc: "10 coder followers",
      ruleDesc: "Reach 10 developer followers in your network.",
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

  const previewBadges = specialBadges.slice(0, 4);
  const previewAchievements = achievements.slice(0, 4);

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 select-none mt-0">
      <div className="flex flex-col gap-2.5 sm:gap-3">
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

        <div className="grid grid-cols-4 gap-1 sm:gap-3 md:gap-5 items-center justify-items-center py-0 -mx-1 sm:mx-0">
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
                      ? "w-full aspect-square max-w-[88px] min-[390px]:max-w-[96px] min-[420px]:max-w-[102px] sm:max-w-[115px] md:max-w-[130px]"
                      : `w-full aspect-square max-w-[76px] sm:max-w-[86px] border-4 ${
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

      <div className="flex flex-col gap-2.5 sm:gap-3">
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

        <div className="grid grid-cols-4 gap-1 sm:gap-3 md:gap-5 items-center justify-items-center py-0 -mx-1 sm:mx-0">
          {previewAchievements.map((ach) => {
            const isUnlocked = ach.current >= ach.target;
            const customImg = customAchievementImages[ach.id];
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
                {customImg ? (
                  <div className="w-full aspect-[84/100] max-w-[84px] min-[390px]:max-w-[92px] min-[420px]:max-w-[98px] sm:max-w-[110px] md:max-w-[125px] flex items-center justify-center transition-transform group-hover:scale-105">
                    <img
                      src={customImg}
                      alt={ach.name}
                      className={`w-full h-full object-contain transition-all ${
                        isUnlocked ? "" : "grayscale opacity-50"
                      }`}
                    />
                  </div>
                ) : (
                  <div
                    className={`w-full max-w-[76px] min-[390px]:max-w-[84px] sm:max-w-[86px] aspect-[68/76] sm:aspect-[84/92] relative flex flex-col items-center justify-between pt-2 pb-1.5 transition-transform group-hover:scale-105 ${
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
                )}
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

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {activeModal === "badges_all" ? (
                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 items-start justify-items-center py-2">
                  {specialBadges.map((badge) => {
                    const isUnlocked = badge.current >= badge.target;
                    const customImg = customBadgeImages[badge.id];
                    const percent = Math.min(100, Math.round((badge.current / badge.target) * 100));

                    return (
                      <div
                        key={badge.id}
                        onClick={() => {
                          soundEffects.playSoftClick();
                          setSelectedHonor({ type: "badge", item: badge });
                        }}
                        className="w-full flex flex-col items-center justify-start p-2.5 sm:p-3 rounded-2xl bg-[#0b1426] border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div
                          className={`rounded-full flex items-center justify-center relative transition-transform ${
                            customImg
                              ? "w-full aspect-square max-w-[84px] sm:max-w-[100px]"
                              : `w-full aspect-square max-w-[72px] sm:max-w-[88px] border-4 ${
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
                              className={`w-full h-full object-contain ${
                                isUnlocked ? "" : "grayscale opacity-50"
                              }`}
                            />
                          ) : (
                            badge.iconSvg(isUnlocked, 44)
                          )}
                        </div>

                        <span className="text-xs sm:text-sm font-black text-white text-center mt-2 truncate w-full px-1">
                          {badge.name}
                        </span>

                        <div className="w-full flex items-center gap-1.5 mt-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                            {badge.current}/{badge.target}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 items-start justify-items-center py-2">
                  {achievements.map((ach) => {
                    const isUnlocked = ach.current >= ach.target;
                    const customImg = customAchievementImages[ach.id];
                    const percent = Math.min(100, Math.round((ach.current / ach.target) * 100));

                    return (
                      <div
                        key={ach.id}
                        onClick={() => {
                          soundEffects.playSoftClick();
                          setSelectedHonor({ type: "achievement", item: ach });
                        }}
                        className="w-full flex flex-col items-center justify-start p-2.5 sm:p-3 rounded-2xl bg-[#0b1426] border border-slate-800 hover:border-slate-700 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div className="w-full aspect-[84/100] max-w-[80px] sm:max-w-[96px] flex items-center justify-center">
                          {customImg ? (
                            <img
                              src={customImg}
                              alt={ach.name}
                              className={`w-full h-full object-contain ${
                                isUnlocked ? "" : "grayscale opacity-50"
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {ach.iconSvg(isUnlocked, 40)}
                            </div>
                          )}
                        </div>

                        <span className="text-xs sm:text-sm font-black text-white text-center mt-2 truncate w-full px-1">
                          {ach.name}
                        </span>

                        <div className="w-full flex items-center gap-1.5 mt-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                            {ach.current.toLocaleString()}/{ach.target.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  customBadgeImages[selectedHonor.item.id] ||
                  customAchievementImages[selectedHonor.item.id]
                    ? "w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]"
                    : "w-[150px] h-[150px] rounded-3xl bg-slate-950 border-2 border-slate-800"
                }`}
              >
                {customBadgeImages[selectedHonor.item.id] ||
                customAchievementImages[selectedHonor.item.id] ? (
                  <img
                    src={
                      customBadgeImages[selectedHonor.item.id] ||
                      customAchievementImages[selectedHonor.item.id]
                    }
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

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-bold px-2 mb-6 text-center">
                {selectedHonor.item.ruleDesc}
              </p>

              <div className="w-full p-4 rounded-2xl bg-[#091122] border border-slate-800 flex flex-col gap-2.5 mb-6">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black text-slate-300">
                  <span>Progress</span>
                  <span className="font-mono text-amber-400 font-black">
                    {selectedHonor.item.current.toLocaleString()} / {selectedHonor.item.target.toLocaleString()} ({Math.min(
                      100,
                      Math.round((selectedHonor.item.current / selectedHonor.item.target) * 100)
                    )}%)
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
