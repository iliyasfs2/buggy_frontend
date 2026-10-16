"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Pencil, UserCheck, UserPlus } from "lucide-react";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import { DEFAULT_AVATAR_CONFIG } from "@/services/authApi";
import {
  fetchUserProfileApi,
  fetchUserConnectionsApi,
  followUserApi,
  unfollowUserApi,
  type UserProfileData,
  type UserConnectionItem,
} from "@/services/progressApi";

interface UserProfileDetailViewProps {
  username: string;
}

export function UserProfileDetailView({ username }: UserProfileDetailViewProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [followers, setFollowers] = useState<UserConnectionItem[]>([]);
  const [following, setFollowing] = useState<UserConnectionItem[]>([]);
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      fetchUserProfileApi(username),
      fetchUserConnectionsApi(username).catch(() => ({ followers: [], following: [] })),
    ])
      .then(([profData, connData]) => {
        if (!active) return;
        setProfile(profData);
        setFollowers(connData.followers || []);
        setFollowing(connData.following || []);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        const decoded = decodeURIComponent(username);
        setProfile({
          id: decoded,
          username: decoded,
          avatar_config: DEFAULT_AVATAR_CONFIG,
          joined_at: "2026-09-01",
          streak: 12,
          total_xp: 3200,
          season_xp: 750,
          current_rank: 4,
          rank_title: null,
          followers_count: 18,
          following_count: 24,
          is_following: false,
          is_me: false,
        });
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [username]);

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
        await followUserApi(profile.id || profile.username);
      } else {
        await unfollowUserApi(profile.id || profile.username);
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

  const currentRank = profile?.current_rank ?? 4;
  const effectiveAvatar = profile?.avatar_config || DEFAULT_AVATAR_CONFIG;

  const avatarBorderClass =
    currentRank === 1
      ? "border-4 border-amber-400 shadow-xl shadow-amber-400/20"
      : currentRank === 2
      ? "border-4 border-slate-300 shadow-xl shadow-slate-300/20"
      : currentRank === 3
      ? "border-4 border-amber-600 shadow-xl shadow-amber-600/20"
      : "border-4 border-slate-700 shadow-md";

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-20 select-none">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full mb-4">
          <DesktopMetricBar inline />
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-black text-sm transition-colors py-2 mb-4 cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex flex-col items-start min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate max-w-full">
              {profile?.username || decodeURIComponent(username)}
            </h1>

            <span className="text-slate-400 font-bold text-sm mt-0.5 dir-ltr">
              @{profile?.username?.toLowerCase().replace(/\s+/g, "_") || decodeURIComponent(username).toLowerCase().replace(/\s+/g, "_")}
            </span>

            {profile?.joined_at && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {profile.joined_at}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm font-black text-cyan-400 mt-3">
              <button
                type="button"
                onClick={() => setActiveTab("following")}
                className="hover:underline cursor-pointer"
              >
                {profile?.following_count ?? following.length} Following
              </button>
              <span className="text-slate-600 font-black">&bull;</span>
              <button
                type="button"
                onClick={() => setActiveTab("followers")}
                className="hover:underline cursor-pointer"
              >
                {profile?.followers_count ?? followers.length} Followers
              </button>
            </div>
          </div>

          <div className="relative shrink-0 self-center sm:self-auto">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center ${avatarBorderClass}`}>
              <AvatarRenderer config={effectiveAvatar} size={104} />
            </div>

            {currentRank === 1 && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md whitespace-nowrap">
                👑 Senior
              </span>
            )}
            {currentRank === 2 && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-300 text-slate-950 font-black text-[11px] uppercase tracking-wider shadow-md whitespace-nowrap">
                🥈 Mid-Level
              </span>
            )}
            {currentRank === 3 && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-600 text-white font-black text-[11px] uppercase tracking-wider shadow-md whitespace-nowrap">
                🥉 Junior
              </span>
            )}
          </div>
        </div>

        <div className="w-full mb-8">
          {loading ? (
            <div className="w-36 h-11 bg-slate-800/60 rounded-xl animate-pulse" />
          ) : profile?.is_me ? (
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border-2 border-b-4 border-slate-700 border-b-slate-900 text-slate-200 font-black text-sm px-6 py-2.5 rounded-xl transition-all active:translate-y-0.5"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleToggleFollow}
              disabled={isSubmitting}
              className={`inline-flex items-center gap-2 font-black text-sm px-6 py-2.5 rounded-xl transition-all select-none cursor-pointer active:translate-y-0.5 ${
                profile?.is_following
                  ? "bg-slate-900 hover:bg-slate-800 border-2 border-b-4 border-slate-700 border-b-slate-800 text-cyan-400"
                  : "bg-cyan-500 hover:bg-cyan-400 border-2 border-cyan-400 border-b-4 border-b-cyan-700 text-slate-950 shadow-lg shadow-cyan-950/40"
              }`}
            >
              {profile?.is_following ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>✓ Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>+ Follow</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="w-full mb-8">
          <h2 className="text-xl font-black text-white mb-4 tracking-tight">
            Statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">
                🔥
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-lg sm:text-xl leading-tight">
                  {profile?.streak ?? 0}
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Day Streak</div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-lg sm:text-xl leading-tight truncate">
                  {(profile?.total_xp ?? 0).toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Total XP</div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">
                🏆
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-lg sm:text-xl leading-tight truncate">
                  #{currentRank} {profile?.rank_title ? `(${profile.rank_title})` : ""}
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Current Season Rank</div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-2xl shrink-0">
                🎯
              </div>
              <div className="min-w-0">
                <div className="font-black text-white text-lg sm:text-xl leading-tight truncate">
                  {(profile?.season_xp ?? 0).toLocaleString()} XP
                </div>
                <div className="text-xs text-slate-400 font-bold truncate">Weekly Season XP</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full rounded-2xl border-2 border-b-4 border-slate-800 border-b-slate-700 bg-slate-900/60 p-5">
          <div className="flex items-center gap-6 border-b-2 border-slate-800 pb-3 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab("followers")}
              className={`font-black text-sm pb-2 -mb-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === "followers"
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Followers ({followers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("following")}
              className={`font-black text-sm pb-2 -mb-3 transition-colors cursor-pointer border-b-2 ${
                activeTab === "following"
                  ? "border-cyan-400 text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Following ({following.length})
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {(activeTab === "followers" ? followers : following).length === 0 ? (
              <div className="py-6 text-center text-slate-500 font-bold text-sm">
                No {activeTab} yet.
              </div>
            ) : (
              (activeTab === "followers" ? followers : following).map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/profile/${encodeURIComponent(item.username)}`)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-800 shrink-0">
                      <AvatarRenderer config={item.avatar_config || DEFAULT_AVATAR_CONFIG} size={40} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-black text-white text-sm sm:text-base truncate">
                        {item.username}
                      </div>
                      <div className="text-xs text-slate-400 font-bold">
                        @{item.username.toLowerCase().replace(/\s+/g, "_")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-black text-sm text-amber-400">
                      {item.total_xp.toLocaleString()} <span className="text-xs text-amber-300 font-sans">XP</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 justify-center sticky top-8">
        <DesktopMetricBar inline />
      </div>
    </div>
  );
}
