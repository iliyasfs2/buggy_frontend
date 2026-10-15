"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Flame, Clock, Trophy, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
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

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "00d 00h 00m 00s";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`;
}

export function LeaderboardView() {
  const { user } = useAuthStore();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(12 * 86400 + 8 * 3600 + 14 * 60);

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

  const seasonTitle = data?.season?.title || "Season 1: Obsidian League";
  const seasonDescription =
    data?.season?.description ||
    "Special Byte rewards awarded to the Top 3 coders at season end!";

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
    <div className="w-full max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8 pb-32 md:pb-16 select-none">
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border-2 border-slate-800 shadow-2xl flex flex-col items-center text-center gap-5 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-32 h-24 flex items-center justify-center">
          <Image
            src="/icons/leaderboard.png"
            alt="Season Podium"
            width={128}
            height={96}
            className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(245,158,11,0.35)]"
            priority
          />
        </div>

        <div className="flex flex-col gap-2 max-w-lg">
          <div className="inline-flex items-center justify-center gap-1.5 mx-auto px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Active League Season
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight">
            {seasonTitle}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-400">
            {seasonDescription}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full max-w-md pt-1">
          <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-md">
            <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-wider">
              1st Place
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Image src="/icons/byte.png" alt="Byte" width={16} height={16} className="w-4 h-4 object-contain" />
              <span className="font-mono font-black text-xs sm:text-sm text-slate-100">
                +200
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-2xl bg-slate-400/10 border border-slate-400/30 shadow-md">
            <span className="text-[10px] sm:text-xs font-black text-slate-300 uppercase tracking-wider">
              2nd Place
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Image src="/icons/byte.png" alt="Byte" width={16} height={16} className="w-4 h-4 object-contain" />
              <span className="font-mono font-black text-xs sm:text-sm text-slate-100">
                +100
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center p-2.5 sm:p-3 rounded-2xl bg-amber-700/15 border border-amber-700/35 shadow-md">
            <span className="text-[10px] sm:text-xs font-black text-amber-500 uppercase tracking-wider">
              3rd Place
            </span>
            <div className="flex items-center gap-1 mt-1">
              <Image src="/icons/byte.png" alt="Byte" width={16} height={16} className="w-4 h-4 object-contain" />
              <span className="font-mono font-black text-xs sm:text-sm text-slate-100">
                +50
              </span>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner mt-1">
          <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
            Season Ends In:
          </span>
          <span className="font-mono font-black text-sm sm:text-base text-amber-300">
            {formatCountdown(secondsLeft)}
          </span>
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
