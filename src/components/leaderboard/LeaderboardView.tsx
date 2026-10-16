"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Flame, Trophy } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import {
  fetchLeaderboardApi,
  type LeaderboardResponse,
  type LeaderboardUserEntry,
} from "@/services/progressApi";

const FALLBACK_USERS: LeaderboardUserEntry[] = [
  {
    rank: 1,
    id: "peer_1",
    username: "Alex Rivera",
    coder_title: "Algorithm Architect",
    season_xp: 840,
    streak: 14,
    is_current_user: false,
    avatar_config: {
      skin_color: "#FCD34D",
      hair_style: "short_wavy",
      hair_color: "#1E293B",
      eye_style: "round",
      expression: "happy",
      accessory: "yellow_glasses",
      shirt_color: "#0284C7",
      bg_color: "#0F172A",
    },
  },
  {
    rank: 2,
    id: "peer_2",
    username: "Sarah Chen",
    coder_title: "Code Virtuoso",
    season_xp: 720,
    streak: 11,
    is_current_user: false,
    avatar_config: {
      skin_color: "#FBBF24",
      hair_style: "long_straight",
      hair_color: "#0F172A",
      eye_style: "cat",
      expression: "confident",
      accessory: "headband",
      shirt_color: "#8B5CF6",
      bg_color: "#18181B",
    },
  },
  {
    rank: 3,
    id: "peer_3",
    username: "Marcus Vance",
    coder_title: "Bug Slayer",
    season_xp: 610,
    streak: 9,
    is_current_user: false,
    avatar_config: {
      skin_color: "#FDE68A",
      hair_style: "buzz",
      hair_color: "#78350F",
      eye_style: "focused",
      expression: "smirk",
      accessory: "none",
      shirt_color: "#EF4444",
      bg_color: "#111827",
    },
  },
  {
    rank: 4,
    id: "peer_4",
    username: "Elena Rostova",
    coder_title: "Fullstack Ninja",
    season_xp: 490,
    streak: 8,
    is_current_user: false,
  },
  {
    rank: 5,
    id: "peer_5",
    username: "David Kim",
    coder_title: "Fullstack Ninja",
    season_xp: 410,
    streak: 7,
    is_current_user: false,
  },
  {
    rank: 6,
    id: "peer_6",
    username: "Maya Patel",
    coder_title: "Logic Maestro",
    season_xp: 360,
    streak: 6,
    is_current_user: false,
  },
  {
    rank: 7,
    id: "peer_7",
    username: "Liam O'Connor",
    coder_title: "Logic Maestro",
    season_xp: 320,
    streak: 5,
    is_current_user: false,
  },
  {
    rank: 8,
    id: "peer_8",
    username: "Sofia Gomez",
    coder_title: "Logic Maestro",
    season_xp: 280,
    streak: 5,
    is_current_user: false,
  },
  {
    rank: 9,
    id: "current",
    username: "You",
    coder_title: "Logic Maestro",
    season_xp: 265,
    streak: 3,
    is_current_user: true,
  },
  {
    rank: 10,
    id: "peer_9",
    username: "Kenji Sato",
    coder_title: "Logic Maestro",
    season_xp: 250,
    streak: 4,
    is_current_user: false,
  },
  {
    rank: 11,
    id: "peer_10",
    username: "Amina Diallo",
    coder_title: "Syntax Sorcerer",
    season_xp: 220,
    streak: 4,
    is_current_user: false,
  },
  {
    rank: 12,
    id: "peer_11",
    username: "Lucas Meyer",
    coder_title: "Syntax Sorcerer",
    season_xp: 200,
    streak: 3,
    is_current_user: false,
  },
  {
    rank: 13,
    id: "peer_12",
    username: "Chloe Martin",
    coder_title: "Syntax Sorcerer",
    season_xp: 180,
    streak: 3,
    is_current_user: false,
  },
  {
    rank: 14,
    id: "peer_13",
    username: "Omar Farooq",
    coder_title: "Syntax Sorcerer",
    season_xp: 160,
    streak: 3,
    is_current_user: false,
  },
  {
    rank: 15,
    id: "peer_14",
    username: "Zoe Bennett",
    coder_title: "Syntax Sorcerer",
    season_xp: 140,
    streak: 2,
    is_current_user: false,
  },
  {
    rank: 16,
    id: "peer_15",
    username: "Vikram Singh",
    coder_title: "Async Wizard",
    season_xp: 130,
    streak: 2,
    is_current_user: false,
  },
  {
    rank: 17,
    id: "peer_16",
    username: "Emma Watson",
    coder_title: "Async Wizard",
    season_xp: 120,
    streak: 2,
    is_current_user: false,
  },
  {
    rank: 18,
    id: "peer_17",
    username: "Nils Lindholm",
    coder_title: "Async Wizard",
    season_xp: 110,
    streak: 2,
    is_current_user: false,
  },
  {
    rank: 19,
    id: "peer_18",
    username: "Tanya Sharma",
    coder_title: "Async Wizard",
    season_xp: 100,
    streak: 1,
    is_current_user: false,
  },
  {
    rank: 20,
    id: "peer_19",
    username: "Gabriel Silva",
    coder_title: "Async Wizard",
    season_xp: 90,
    streak: 1,
    is_current_user: false,
  },
  {
    rank: 21,
    id: "peer_20",
    username: "Hannah Schmidt",
    coder_title: "Binary Overlord",
    season_xp: 80,
    streak: 1,
    is_current_user: false,
  },
  {
    rank: 22,
    id: "peer_21",
    username: "Taro Tanaka",
    coder_title: "Binary Overlord",
    season_xp: 70,
    streak: 1,
    is_current_user: false,
  },
  {
    rank: 23,
    id: "peer_22",
    username: "Leila Hassan",
    coder_title: "Binary Overlord",
    season_xp: 60,
    streak: 1,
    is_current_user: false,
  },
  {
    rank: 24,
    id: "peer_23",
    username: "Mateo Rossi",
    coder_title: "Binary Overlord",
    season_xp: 50,
    streak: 1,
    is_current_user: false,
  },
  {
    rank: 25,
    id: "peer_24",
    username: "Olga Novak",
    coder_title: "Binary Overlord",
    season_xp: 40,
    streak: 0,
    is_current_user: false,
  },
];

function getCountdownParts(seconds: number): { days: string; hours: string } {
  const safe = Math.max(0, seconds);
  const days = Math.floor(safe / 86400);
  const hours = Math.floor((safe % 86400) / 3600);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return { days: pad(days), hours: pad(hours) };
}

export function LeaderboardView() {
  const { user } = useAuthStore();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(6 * 86400 + 12 * 3600);

  const loadData = async () => {
    try {
      const res = await fetchLeaderboardApi();
      setData(res);
      if (res.season?.seconds_left !== undefined) {
        setSecondsLeft(res.season.seconds_left);
      }
    } catch {
      setData(null);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { days: countdownDays, hours: countdownHours } = getCountdownParts(secondsLeft);

  const leaderboardList = useMemo(() => {
    if (data?.leaderboard && data.leaderboard.length > 0) {
      return data.leaderboard;
    }
    return FALLBACK_USERS;
  }, [data]);

  const currentUserInfo = useMemo(() => {
    if (data?.current_user) {
      return data.current_user;
    }
    const fallbackUser = leaderboardList.find((u) => u.is_current_user);
    return {
      id: "current",
      username: user?.username || "You",
      rank: fallbackUser?.rank || 9,
      season_xp: fallbackUser?.season_xp || 265,
      total_xp: 265,
      streak: fallbackUser?.streak || 3,
      coder_title: fallbackUser?.coder_title || "Logic Maestro",
      avatar_config: user?.avatar_config || user?.avatar,
      is_top: true,
    };
  }, [data, leaderboardList, user]);

  const top1 = leaderboardList[0];
  const top2 = leaderboardList[1];
  const top3 = leaderboardList[2];
  const remainingList = leaderboardList.slice(3);

  const isUserInTopList = currentUserInfo.is_top && currentUserInfo.rank <= 25;
  const rank25Xp = leaderboardList[24]?.season_xp || 40;
  const gapToTop25 = Math.max(0, rank25Xp - currentUserInfo.season_xp + 10);

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-32 md:pb-16 select-none">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col gap-8 shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full">
          <DesktopMetricBar inline />
        </div>
        <div className="relative w-full select-none">
          <Image
            src="/images/leaderboard-banner.png"
            alt="Leaderboard Season Banner"
            width={2991}
            height={714}
            quality={100}
            unoptimized
            priority
            className="w-full h-auto block object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] pointer-events-none"
          />

          <div className="absolute top-[9%] bottom-[7%] left-[4%] right-[32%] flex flex-row items-center justify-end">
            <div className="flex flex-col justify-center items-end text-right">
              <h1 className="text-sm sm:text-lg md:text-xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                Current Compile Season
              </h1>

              <div className="mt-1 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-950/60 border border-cyan-400/25 backdrop-blur-sm">
                <span className="text-[10px] sm:text-xs">⏳</span>
                <span className="text-[10px] sm:text-xs md:text-sm font-black text-cyan-300 whitespace-nowrap">
                  {countdownDays} days and {countdownHours} hours until season reset
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Top 3 Champions
          </h2>
          <span className="text-xs font-bold text-slate-400">
            Podium Rewards
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 items-end pt-4 pb-2">
          {top2 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950 border-2 border-slate-300 shadow-lg shadow-slate-400/20 overflow-hidden flex items-center justify-center">
                  <AvatarRenderer config={top2.avatar_config} size={80} />
                </div>
                <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-slate-400 text-slate-950 font-black text-[11px] shadow">
                  #2
                </span>
              </div>
              <div className="w-full flex flex-col items-center p-3 rounded-2xl bg-slate-900/80 border-2 border-slate-400/30 text-center gap-1 shadow-md">
                <span className="text-xs sm:text-sm font-black text-slate-100 truncate w-full">
                  {top2.username}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 truncate w-full">
                  {top2.coder_title}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-orange-400 font-bold">
                  <Flame className="w-3 h-3 fill-orange-400" />
                  {top2.streak}d
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 font-mono font-black text-xs sm:text-sm">
                  {top2.season_xp} <span className="text-[10px] text-slate-400 font-sans">XP</span>
                </div>
              </div>
            </div>
          )}

          {top1 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex flex-col items-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 border-4 border-amber-400 shadow-xl shadow-amber-500/30 overflow-hidden flex items-center justify-center ring-4 ring-amber-500/20">
                  <AvatarRenderer config={top1.avatar_config} size={96} />
                </div>
                <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                  #1
                </span>
              </div>
              <div className="w-full flex flex-col items-center p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 text-center gap-1 shadow-lg shadow-amber-500/10">
                <span className="text-xs sm:text-base font-black text-amber-200 truncate w-full">
                  {top1.username}
                </span>
                <span className="text-[10px] sm:text-xs font-black text-amber-400 truncate w-full">
                  {top1.coder_title}
                </span>
                <div className="flex items-center gap-1 text-xs font-mono text-orange-400 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  {top1.streak}d
                </div>
                <div className="mt-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-black text-sm sm:text-base">
                  {top1.season_xp} <span className="text-[10px] text-amber-400/80 font-sans">XP</span>
                </div>
              </div>
            </div>
          )}

          {top3 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-2 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-950 border-2 border-amber-700 shadow-lg shadow-amber-700/20 overflow-hidden flex items-center justify-center">
                  <AvatarRenderer config={top3.avatar_config} size={80} />
                </div>
                <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-amber-700 text-white font-black text-[11px] shadow">
                  #3
                </span>
              </div>
              <div className="w-full flex flex-col items-center p-3 rounded-2xl bg-slate-900/80 border-2 border-amber-700/35 text-center gap-1 shadow-md">
                <span className="text-xs sm:text-sm font-black text-slate-200 truncate w-full">
                  {top3.username}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 truncate w-full">
                  {top3.coder_title}
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-orange-400 font-bold">
                  <Flame className="w-3 h-3 fill-orange-400" />
                  {top3.streak}d
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 font-mono font-black text-xs sm:text-sm">
                  {top3.season_xp} <span className="text-[10px] text-slate-400 font-sans">XP</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider">
            League Rankings
          </h2>
          <span className="text-xs font-bold text-slate-400">
            Top 25 Contenders
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {remainingList.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-2xl border-2 transition-all ${
                item.is_current_user
                  ? "bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-400/40"
                  : "bg-slate-900/70 border-slate-800 hover:border-slate-700/80"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-8 flex items-center justify-center shrink-0">
                  <span className="font-mono font-bold text-slate-500 text-sm">
                    {item.rank}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.avatar_config ? (
                    <AvatarRenderer config={item.avatar_config} size={40} />
                  ) : (
                    <span className="font-black text-slate-400 text-sm">
                      {item.username.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black text-sm truncate ${
                        item.is_current_user ? "text-blue-300" : "text-slate-200"
                      }`}
                    >
                      {item.username}
                    </span>
                    {item.is_current_user && (
                      <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-500 text-slate-950">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="text-slate-400 truncate">{item.coder_title}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-orange-400/90 font-mono">
                      <Flame className="w-3 h-3 fill-orange-400" />
                      {item.streak}d
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono font-black text-sm sm:text-base text-slate-200">
                  {item.season_xp} <span className="text-xs text-slate-500 font-sans">XP</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="hidden lg:flex flex-1 justify-center sticky top-8">
      <DesktopMetricBar inline />
    </div>

      {!isUserInTopList && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-3xl z-30">
          <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border-2 border-blue-500 shadow-2xl shadow-blue-900/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="px-2.5 py-1 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 font-mono font-black text-sm shrink-0">
                #{currentUserInfo.rank}
              </div>

              <div className="w-10 h-10 rounded-full bg-slate-950 border border-blue-500/40 overflow-hidden shrink-0 flex items-center justify-center">
                <AvatarRenderer config={currentUserInfo.avatar_config} size={40} />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-blue-200 truncate">
                    {currentUserInfo.username}
                  </span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-blue-500 text-slate-950">
                    YOU
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <span>{currentUserInfo.coder_title}</span>
                  <span>•</span>
                  <span className="text-amber-400/90 font-mono">
                    +{gapToTop25} XP to enter Top 25
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1 text-xs font-mono text-orange-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                {currentUserInfo.streak}d
              </div>
              <span className="font-mono font-black text-base text-blue-300">
                {currentUserInfo.season_xp} <span className="text-xs text-blue-400/70 font-sans">XP</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
