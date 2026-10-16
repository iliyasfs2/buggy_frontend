"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Pencil, UserCheck, UserPlus } from "lucide-react";
import { AvatarRenderer } from "@/components/profile/AvatarRenderer";
import { AvatarCustomizerModal } from "@/components/profile/AvatarCustomizerModal";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import { soundEffects } from "@/utils/soundEffects";
import { useAuthStore } from "@/store/useAuthStore";
import { DEFAULT_AVATAR_CONFIG, type AvatarConfig } from "@/services/authApi";
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
  const { user: currentUser, updateAvatar } = useAuthStore();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [followers, setFollowers] = useState<UserConnectionItem[]>([]);
  const [following, setFollowing] = useState<UserConnectionItem[]>([]);
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const targetIdentifier = useMemo(() => {
    const raw = decodeURIComponent(username).trim();
    if (raw.toLowerCase() === "current") {
      return currentUser?.username || "You";
    }
    return raw;
  }, [username, currentUser?.username]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      fetchUserProfileApi(targetIdentifier),
      fetchUserConnectionsApi(targetIdentifier).catch(() => ({ followers: [], following: [] })),
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
        const isSelf =
          targetIdentifier.toLowerCase() === "you" ||
          targetIdentifier.toLowerCase() === "current" ||
          (currentUser?.username && targetIdentifier.toLowerCase() === currentUser.username.toLowerCase());

        setProfile({
          id: targetIdentifier,
          username: isSelf ? (currentUser?.username || "You") : targetIdentifier,
          avatar_config: isSelf
            ? (currentUser?.avatar_config || currentUser?.avatar || DEFAULT_AVATAR_CONFIG)
            : DEFAULT_AVATAR_CONFIG,
          joined_at: currentUser?.created_at ? currentUser.created_at.slice(0, 10) : "2026-09-01",
          streak: isSelf ? 1 : 0,
          total_xp: isSelf ? 50 : 0,
          season_xp: 0,
          current_rank: 20,
          rank_title: null,
          followers_count: 0,
          following_count: 0,
          is_following: false,
          is_me: Boolean(isSelf),
        });
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [targetIdentifier, currentUser]);

  const handleToggleFollow = useCallback(async () => {
    if (!profile || profile.is_me || isSubmitting) return;

    soundEffects.playSoftClick();
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

  const handleSaveAvatar = async (config: AvatarConfig) => {
    await updateAvatar(config);
    setProfile((prev) => (prev ? { ...prev, avatar_config: config } : null));
    setIsEditModalOpen(false);
  };

  const handleBack = () => {
    soundEffects.playSoftClick();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/leaderboard");
    }
  };

  const currentRank = profile?.current_rank ?? 20;
  const effectiveAvatar =
    (profile?.is_me
      ? currentUser?.avatar_config || currentUser?.avatar || profile?.avatar_config
      : profile?.avatar_config) || DEFAULT_AVATAR_CONFIG;

  const avatarBorderClass =
    currentRank === 1
      ? "border-4 border-amber-400 shadow-xl shadow-amber-400/25"
      : currentRank === 2
      ? "border-4 border-slate-300 shadow-xl shadow-slate-300/25"
      : currentRank === 3
      ? "border-4 border-amber-600 shadow-xl shadow-amber-600/25"
      : "border-4 border-slate-700 shadow-md";

  const formattedJoinedDate = useMemo(() => {
    if (!profile?.joined_at) return null;
    try {
      const d = new Date(profile.joined_at);
      if (isNaN(d.getTime())) return `Joined ${profile.joined_at}`;
      return `Joined ${d.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
    } catch {
      return `Joined ${profile.joined_at}`;
    }
  }, [profile?.joined_at]);

  const profileDisplayName = profile?.username || targetIdentifier;
  const profileHandle = profileDisplayName.toLowerCase().replace(/\s+/g, "_");

  return (
    <div className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 flex flex-col lg:flex-row items-start gap-8 xl:gap-14 pb-20 select-none">
      <div className="w-full max-w-xl xl:max-w-2xl flex flex-col shrink-0">
        <div className="hidden md:flex lg:hidden justify-end w-full mb-4">
          <DesktopMetricBar inline />
        </div>

        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-black text-sm transition-colors py-2 mb-4 cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leaderboard</span>
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex flex-col items-start min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate max-w-full">
              {profileDisplayName}
            </h1>

            <span className="text-slate-400 font-bold text-sm mt-0.5 dir-ltr">
              @{profileHandle}
            </span>

            {formattedJoinedDate && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedJoinedDate}</span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm font-black text-cyan-400 mt-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab("following");
                }}
                className="hover:underline cursor-pointer"
              >
                {profile?.following_count ?? following.length} Following
              </button>
              <span className="text-slate-600 font-black">&bull;</span>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setActiveTab("followers");
                }}
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

            {profile?.is_me && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setIsEditModalOpen(true);
                }}
                aria-label="Change Avatar"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 flex items-center justify-center border-b-2 border-amber-600 active:translate-y-0.5 shadow-md transition-all cursor-pointer z-10"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full mb-8">
          {loading ? (
            <div className="w-36 h-11 bg-slate-800/60 rounded-xl animate-pulse" />
          ) : profile?.is_me ? (
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border-2 border-b-4 border-slate-700 border-b-slate-900 text-slate-200 font-black text-sm px-6 py-2.5 rounded-xl transition-all active:translate-y-0.5 shadow-md"
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
                  ? "bg-slate-900 hover:bg-slate-800 border-2 border-b-4 border-slate-700 border-b-slate-800 text-cyan-400 shadow-md"
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
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("followers");
              }}
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
              onClick={() => {
                soundEffects.playSoftClick();
                setActiveTab("following");
              }}
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
                  onClick={() => {
                    soundEffects.playSoftClick();
                    router.push(`/profile/${encodeURIComponent(item.username)}`);
                  }}
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

      <AvatarCustomizerModal
        isOpen={isEditModalOpen}
        initialConfig={effectiveAvatar}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveAvatar}
      />
    </div>
  );
}
