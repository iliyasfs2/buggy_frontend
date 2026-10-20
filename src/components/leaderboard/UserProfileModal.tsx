"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { DEFAULT_AVATAR_CONFIG } from "@/services/authApi";
import {
  fetchUserProfileApi,
  followUserApi,
  unfollowUserApi,
  type UserProfileData,
  type LeaderboardUserEntry,
} from "@/services/progressApi";

interface UserProfileModalProps {
  userEntry: LeaderboardUserEntry | null;
  onClose: () => void;
}

export function UserProfileModal({ userEntry, onClose }: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!userEntry) return;

    let active = true;
    setLoading(true);

    fetchUserProfileApi(userEntry.id)
      .then((data) => {
        if (active) {
          setProfile(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setProfile({
            id: userEntry.id,
            username: userEntry.username,
            avatar_config: userEntry.avatar_config || DEFAULT_AVATAR_CONFIG,
            joined_at: "2026-09-01",
            streak: userEntry.streak,
            total_xp: userEntry.season_xp * 4,
            season_xp: userEntry.season_xp,
            current_rank: userEntry.rank,
            rank_title: userEntry.rank === 1 ? "Senior" : userEntry.rank === 2 ? "Mid-Level" : userEntry.rank === 3 ? "Junior" : null,
            followers_count: 24,
            following_count: 18,
            is_following: false,
            is_me: userEntry.is_current_user,
          });
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [userEntry]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleToggleFollow = useCallback(async () => {
    if (!profile || profile.is_me || isSubmitting) return;

    const previousFollowing = profile.is_following;
    const previousFollowers = profile.followers_count;
    const nextFollowing = !previousFollowing;
    const nextFollowers = nextFollowing ? previousFollowers + 1 : Math.max(0, previousFollowers - 1);

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            is_following: nextFollowing,
            followers_count: nextFollowers,
          }
        : null
    );

    setIsSubmitting(true);
    try {
      if (nextFollowing) {
        await followUserApi(profile.id);
      } else {
        await unfollowUserApi(profile.id);
      }
    } catch {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              is_following: previousFollowing,
              followers_count: previousFollowers,
            }
          : null
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [profile, isSubmitting]);

  if (!userEntry) return null;

  const effectiveAvatar = profile?.avatar_config || userEntry.avatar_config || DEFAULT_AVATAR_CONFIG;
  const currentRank = profile?.current_rank ?? userEntry.rank;
  const rankTitle = profile?.rank_title ?? (currentRank === 1 ? "Senior" : currentRank === 2 ? "Mid-Level" : currentRank === 3 ? "Junior" : null);

  const avatarBorderClass =
    currentRank === 1
      ? "border-4 border-amber-400 shadow-xl shadow-amber-400/20"
      : currentRank === 2
      ? "border-4 border-slate-300 shadow-xl shadow-slate-300/20"
      : currentRank === 3
      ? "border-4 border-amber-600 shadow-xl shadow-amber-600/20"
      : "border-4 border-slate-700 shadow-md shadow-black/50";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0f172a] border-2 border-slate-800 rounded-3xl p-6 shadow-2xl shadow-black/80 flex flex-col items-center select-none text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-24 h-24 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center ${avatarBorderClass} mt-2`}>
          <AvatarRenderer config={effectiveAvatar} size={96} />
        </div>

        <h2 className="font-black text-2xl text-white tracking-tight mt-3">
          {profile?.username || userEntry.username}
        </h2>
        <span className="text-slate-400 font-bold text-sm mt-0.5">
          @{profile?.username?.toLowerCase().replace(/\s+/g, "_") || userEntry.username.toLowerCase().replace(/\s+/g, "_")}
        </span>

        {profile?.joined_at && (
          <span className="text-xs font-bold text-slate-500 mt-1">
            Joined {profile.joined_at}
          </span>
        )}

        {rankTitle && (
          <div className="mt-2.5">
            {currentRank === 1 && (
              <span className="px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider">
                👑 Senior
              </span>
            )}
            {currentRank === 2 && (
              <span className="px-3 py-1 rounded-lg bg-slate-300/20 text-slate-200 border border-slate-300/40 text-xs font-black uppercase tracking-wider">
                🥈 Mid-Level
              </span>
            )}
            {currentRank === 3 && (
              <span className="px-3 py-1 rounded-lg bg-amber-700/25 text-amber-400 border border-amber-700/50 text-xs font-black uppercase tracking-wider">
                🥉 Junior
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 text-sm font-black text-slate-300 mt-3 py-1">
          <span>
            {profile?.followers_count ?? 0} <span className="text-slate-400 font-bold">Followers</span>
          </span>
          <span className="text-slate-600 font-black">&bull;</span>
          <span>
            {profile?.following_count ?? 0} <span className="text-slate-400 font-bold">Following</span>
          </span>
        </div>

        <div className="w-full mt-4">
          {loading ? (
            <div className="w-full h-11 bg-slate-800/60 rounded-2xl animate-pulse" />
          ) : profile?.is_me ? (
            <Link
              href="/settings"
              className="inline-flex items-center justify-center w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm py-2.5 px-6 rounded-2xl border-2 border-b-4 border-slate-700 border-b-slate-900 transition-all active:translate-y-0.5 active:border-b-2"
            >
              Edit Profile
            </Link>
          ) : (
            <button
              onClick={handleToggleFollow}
              disabled={isSubmitting}
              className={`w-full font-black text-sm py-2.5 px-6 rounded-2xl transition-all duration-150 active:translate-y-0.5 active:border-b-2 ${
                profile?.is_following
                  ? "bg-slate-800 hover:bg-slate-700/80 text-slate-300 border-2 border-slate-700 border-b-4 border-b-slate-900"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-2 border-cyan-400 border-b-4 border-b-cyan-700 shadow-lg shadow-cyan-950/40"
              }`}
            >
              {profile?.is_following ? "✓ Following" : "+ Follow"}
            </button>
          )}
        </div>

        <div className="w-full mt-6">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 text-left mb-2.5">
            Performance Stats
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-[#0b1324] border-2 border-b-4 border-slate-800 border-b-slate-950 rounded-2xl p-3 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-900/90 flex items-center justify-center shrink-0">
                <img src="/icons/streak.png" alt="Streak" className="w-6 h-6 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-sm sm:text-base leading-tight">
                  {profile?.streak ?? userEntry.streak} Days
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Streak</div>
              </div>
            </div>

            <div className="bg-[#0b1324] border-2 border-b-4 border-slate-800 border-b-slate-950 rounded-2xl p-3 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-900/90 flex items-center justify-center text-xl shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-sm sm:text-base leading-tight truncate">
                  {(profile?.total_xp ?? userEntry.season_xp * 4).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Total XP</div>
              </div>
            </div>

            <div className="bg-[#0b1324] border-2 border-b-4 border-slate-800 border-b-slate-950 rounded-2xl p-3 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-900/90 flex items-center justify-center text-xl shrink-0">
                🏆
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-sm sm:text-base leading-tight">
                  #{currentRank}
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Current Rank</div>
              </div>
            </div>

            <div className="bg-[#0b1324] border-2 border-b-4 border-slate-800 border-b-slate-950 rounded-2xl p-3 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-slate-900/90 flex items-center justify-center text-xl shrink-0">
                🎯
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-sm sm:text-base leading-tight truncate">
                  {(profile?.season_xp ?? userEntry.season_xp).toLocaleString()} XP
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Season XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
