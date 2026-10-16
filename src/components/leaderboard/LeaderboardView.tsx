"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
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

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-16 select-none">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full mb-6">
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

          <div className="absolute top-[8%] bottom-[7%] left-[4%] right-[30%] flex flex-row items-center justify-end">
            <div className="flex flex-col justify-center items-end text-right">
              <h1 className="text-base sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                Current Compile Season
              </h1>

              <div className="mt-1.5 sm:mt-2.5 inline-flex items-center px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-950/70 border border-cyan-400/30 backdrop-blur-md shadow-inner">
                <span className="text-xs sm:text-sm md:text-base font-black text-cyan-300 whitespace-nowrap">
                  {countdownDays} days and {countdownHours} hours until season reset
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-l-2 border-r-2 border-slate-800/80 flex flex-col gap-2 pt-3 pb-8 px-2 sm:px-3">
          {leaderboardList.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-2xl border-2 transition-all ${
                item.is_current_user
                  ? "bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-400/40"
                  : item.rank === 1
                  ? "bg-amber-500/10 border-amber-500/40 shadow-sm hover:border-amber-500/60"
                  : item.rank === 2
                  ? "bg-slate-300/5 border-slate-400/30 hover:border-slate-400/50"
                  : item.rank === 3
                  ? "bg-amber-700/5 border-amber-700/30 hover:border-amber-700/50"
                  : "bg-slate-900/70 border-slate-800 hover:border-slate-700/80"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-8 flex items-center justify-center shrink-0">
                  {item.rank === 1 ? (
                    <span className="text-xl leading-none select-none drop-shadow">👑</span>
                  ) : item.rank === 2 ? (
                    <span className="text-xl leading-none select-none drop-shadow">🥈</span>
                  ) : item.rank === 3 ? (
                    <span className="text-xl leading-none select-none drop-shadow">🥉</span>
                  ) : (
                    <span className="font-mono font-bold text-slate-300 text-sm">
                      {item.rank}
                    </span>
                  )}
                </div>

                <div
                  className={`w-10 h-10 rounded-full bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center ${
                    item.rank === 1
                      ? "border-2 border-amber-400 shadow-sm shadow-amber-500/20"
                      : item.rank === 2
                      ? "border-2 border-slate-300"
                      : item.rank === 3
                      ? "border-2 border-amber-700"
                      : "border border-slate-800"
                  }`}
                >
                  {item.avatar_config ? (
                    <AvatarRenderer config={item.avatar_config} size={40} />
                  ) : (
                    <span className="font-black text-slate-400 text-sm">
                      {item.username.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-black text-sm truncate ${
                        item.is_current_user ? "text-blue-300" : "text-slate-200"
                      }`}
                    >
                      {item.username}
                    </span>
                    {item.rank === 1 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider">
                        Senior
                      </span>
                    )}
                    {item.rank === 2 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-300/20 text-slate-200 border border-slate-300/40 text-[10px] font-black uppercase tracking-wider">
                        Mid-Level
                      </span>
                    )}
                    {item.rank === 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-700/25 text-amber-400 border border-amber-700/50 text-[10px] font-black uppercase tracking-wider">
                        Junior
                      </span>
                    )}
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
                <span className="font-mono font-black text-sm sm:text-base text-amber-400">
                  {item.season_xp.toLocaleString()} <span className="text-xs text-amber-300/80 font-bold font-sans">XP</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center sticky top-8">
        <DesktopMetricBar inline />
      </div>
    </div>
  );
}
