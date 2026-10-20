"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import { DEFAULT_AVATAR_CONFIG } from "@/services/authApi";
import { soundEffects } from "@/utils/soundEffects";
import {
  fetchLeaderboardApi,
  type LeaderboardResponse,
  type LeaderboardUserEntry,
} from "@/services/progressApi";

function getCountdownParts(seconds: number): { days: string; hours: string; minutes: string } {
  const safe = Math.max(0, seconds);
  const days = Math.floor(safe / 86400);
  const hours = Math.floor((safe % 86400) / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return { days: pad(days), hours: pad(hours), minutes: pad(minutes) };
}

export function LeaderboardView() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  const loadData = async () => {
    try {
      const res = await fetchLeaderboardApi();
      setData(res);
      setLoadError(false);
      if (res.season?.seconds_left !== undefined) {
        setSecondsLeft(res.season.seconds_left);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
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

  const { days: countdownDays, hours: countdownHours, minutes: countdownMinutes } = getCountdownParts(secondsLeft);

  const top20List = useMemo(() => {
    return (data?.leaderboard ?? []).slice(0, 20);
  }, [data]);

  const isUserInTop20 = useMemo(() => {
    return top20List.some((item) => item.is_current_user);
  }, [top20List]);

  const outsideUserEntry: LeaderboardUserEntry | null = useMemo(() => {
    if (isUserInTop20) {
      return null;
    }
    if (data?.current_user) {
      return {
        rank: data.current_user.rank,
        id: data.current_user.id,
        username: data.current_user.username || user?.username || "You",
        coder_title: data.current_user.coder_title,
        season_xp: data.current_user.season_xp,
        streak: data.current_user.streak,
        avatar_config: data.current_user.avatar_config || user?.avatar_config || user?.avatar,
        is_current_user: true,
      };
    }
    return null;
  }, [data, isUserInTop20, user]);

  const renderRow = (item: LeaderboardUserEntry) => {
    const avatarConfig = item.is_current_user
      ? (user?.avatar_config || user?.avatar || item.avatar_config || DEFAULT_AVATAR_CONFIG)
      : (item.avatar_config || DEFAULT_AVATAR_CONFIG);
    const displayName = item.is_current_user ? (user?.username || item.username) : item.username;

    return (
      <div
        key={item.id}
        onClick={() => {
          soundEffects.playSoftClick();
          router.push(item.is_current_user ? "/profile" : `/profile/${encodeURIComponent(displayName)}?from=leaderboard`);
        }}
        className={`flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl border-2 border-b-4 transition-all duration-150 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
          item.is_current_user
            ? "bg-gradient-to-r from-blue-950/80 via-blue-900/60 to-indigo-950/80 border-blue-500 border-b-blue-700 shadow-xl shadow-blue-950/50 ring-1 ring-blue-400/50"
            : "bg-[#101826] border-slate-700 border-b-slate-600 shadow-md shadow-black/40 hover:border-slate-600 hover:border-b-slate-500"
        }`}
      >
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="w-7 sm:w-8 flex items-center justify-center shrink-0">
            {item.rank === 1 ? (
              <span className="text-lg sm:text-2xl leading-none select-none drop-shadow">👑</span>
            ) : item.rank === 2 ? (
              <span className="text-lg sm:text-2xl leading-none select-none drop-shadow">🥈</span>
            ) : item.rank === 3 ? (
              <span className="text-lg sm:text-2xl leading-none select-none drop-shadow">🥉</span>
            ) : (
              <span
                className={`font-mono font-black text-xs sm:text-base ${
                  item.is_current_user ? "text-cyan-400" : "text-slate-200"
                }`}
              >
                {item.rank}
              </span>
            )}
          </div>

          <div
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center border-2 shadow-sm ${
              item.is_current_user ? "border-blue-400/60" : "border-slate-800"
            }`}
          >
            <AvatarRenderer config={avatarConfig} size={44} className="w-full h-full" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span
              className={`font-black text-sm sm:text-lg tracking-normal truncate max-w-[105px] min-[360px]:max-w-[135px] min-[420px]:max-w-[180px] sm:max-w-none ${
                item.is_current_user ? "text-cyan-300" : "text-white"
              }`}
            >
              {displayName}
            </span>
            {item.rank === 1 && (
              <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] sm:text-[11px] font-black uppercase tracking-wider">
                Senior
              </span>
            )}
            {item.rank === 2 && (
              <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-slate-300/20 text-slate-200 border border-slate-300/40 text-[9px] sm:text-[11px] font-black uppercase tracking-wider">
                Mid-Level
              </span>
            )}
            {item.rank === 3 && (
              <span className="shrink-0 px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-amber-700/25 text-amber-400 border border-amber-700/50 text-[9px] sm:text-[11px] font-black uppercase tracking-wider">
                Junior
              </span>
            )}
            {item.is_current_user && (
              <span className="shrink-0 text-[9px] sm:text-[11px] uppercase font-black px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg bg-blue-500 text-slate-950 tracking-wide">
                YOU
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2">
          <span className="font-mono font-black text-sm sm:text-lg text-amber-400 whitespace-nowrap">
            {item.season_xp.toLocaleString()} <span className="text-[10px] sm:text-sm text-amber-300 font-black font-sans">XP</span>
          </span>
        </div>
      </div>
    );
  };

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
            width={2399}
            height={714}
            quality={100}
            unoptimized
            priority
            className="w-full h-auto block object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] pointer-events-none"
          />

          <div className="absolute top-[8%] bottom-[7%] left-[5%] sm:left-[6%] right-[28%] sm:right-[30%] md:right-[31%] flex flex-row items-center justify-start">
            <div className="flex flex-col justify-center items-start text-left">
              <h1 className="text-sm min-[360px]:text-base min-[420px]:text-lg sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                Current Compile Season
              </h1>

              <div className="mt-1 sm:mt-2 inline-flex items-center">
                <span className="sm:hidden text-xs min-[360px]:text-sm font-black text-amber-400 drop-shadow-md whitespace-nowrap">
                  {countdownDays}d {countdownHours}h until reset
                </span>
                <span className="hidden sm:inline text-xs sm:text-sm md:text-base font-black text-amber-400 drop-shadow-md whitespace-nowrap">
                  {countdownDays} days and {countdownHours} hours until season reset
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2.5 pt-4 pb-8">
          {loading && top20List.length === 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`sk-${i}`} className="h-[60px] sm:h-[72px] rounded-2xl border-2 border-b-4 border-slate-800 bg-slate-900/50 animate-pulse" />
            ))}
          {!loading && loadError && top20List.length === 0 && (
            <div className="py-10 text-center text-sm font-bold text-slate-400">
              Could not load the leaderboard. Please try again.
            </div>
          )}
          {!loading && !loadError && top20List.length === 0 && (
            <div className="py-10 text-center text-sm font-bold text-slate-400">
              No coders on the leaderboard yet.
            </div>
          )}
          {top20List.map(renderRow)}
          {outsideUserEntry && (
            <>
              {outsideUserEntry.rank > 21 && (
                <div className="flex items-center justify-center py-1 text-slate-500 select-none">
                  <span className="text-xl tracking-[0.4em] font-black leading-none opacity-60">•••</span>
                </div>
              )}
              {renderRow(outsideUserEntry)}
            </>
          )}
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center sticky top-8">
        <DesktopMetricBar inline />
      </div>
    </div>
  );
}
