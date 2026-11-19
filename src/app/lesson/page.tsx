"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import {
  DebugDrillPlayer,
  type CuratedDebugMode,
} from "@/components/debug/DebugDrillPlayer";
import type { LessonContent } from "@/types/lesson";
import {
  SEED_DEBUG_CHALLENGES,
  createMistakesLesson,
} from "@/constants/debugLessons";
import {
  fetchMistakesApi,
  fetchDebugChallengesApi,
  type DebugChallengesData,
} from "@/services/debugApi";
import { LESSON_JS_1_1 } from "@/data/mock/lessons/js-1-1";
import { LESSON_JS_1_2 } from "@/data/mock/lessons/js-1-2";
import { LESSON_JS_1_3 } from "@/data/mock/lessons/js-1-3";
import { LESSON_JS_1_4 } from "@/data/mock/lessons/js-1-4";
import { LESSON_JS_1_5 } from "@/data/mock/lessons/js-1-5";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const getRoadmapLessonContent = (id: string): LessonContent => {
  if (id === "js-1-2") return LESSON_JS_1_2;
  if (id === "js-1-3") return LESSON_JS_1_3;
  if (id === "js-1-4") return LESSON_JS_1_4;
  if (id === "js-1-5") return LESSON_JS_1_5;
  return LESSON_JS_1_1;
};

function isCuratedDebugMode(mode: string): mode is CuratedDebugMode {
  return (
    mode === "debug_tracing" ||
    mode === "debug_refactor" ||
    mode === "debug_stories"
  );
}

function LessonContentController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "";
  const nodeId = searchParams.get("nodeId") || "js-1-1";
  const isDebugSession = Boolean(mode && mode.startsWith("debug"));
  const isCuratedDrill = isCuratedDebugMode(mode);

  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [challenges, setChallenges] = useState<DebugChallengesData>(
    SEED_DEBUG_CHALLENGES
  );
  const [loading, setLoading] = useState(true);
  const [emptyMistakes, setEmptyMistakes] = useState(false);

  useEffect(() => {
    let active = true;

    if (isCuratedDrill) {
      setLoading(true);
      fetchDebugChallengesApi()
        .then((data) => {
          if (!active) return;
          if (
            data &&
            Array.isArray(data.output_lab) &&
            data.output_lab.length > 0
          ) {
            setChallenges(data);
          } else {
            setChallenges(SEED_DEBUG_CHALLENGES);
          }
          setLoading(false);
        })
        .catch(() => {
          if (!active) return;
          setChallenges(SEED_DEBUG_CHALLENGES);
          setLoading(false);
        });
    } else if (mode === "debug_mistakes") {
      setLoading(true);
      fetchMistakesApi()
        .then((res) => {
          if (!active) return;
          if (!res.mistakes || res.mistakes.length === 0) {
            setEmptyMistakes(true);
          } else {
            setLesson(createMistakesLesson(res.mistakes));
          }
          setLoading(false);
        })
        .catch(() => {
          if (!active) return;
          setEmptyMistakes(true);
          setLoading(false);
        });
    } else {
      setLesson(getRoadmapLessonContent(nodeId));
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [mode, nodeId, isCuratedDrill]);

  const handleComplete = () => {
    if (isDebugSession) {
      router.push("/debug");
    } else {
      router.push("/roadmap");
    }
  };

  const handleExit = () => {
    if (isDebugSession) {
      router.push("/debug");
    } else {
      router.push("/roadmap");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-4 text-center select-none">
        <div className="w-12 h-12 rounded-full border-4 border-sky-500 border-t-transparent animate-spin mb-4" />
        <h2 className="text-lg font-black text-white tracking-wide">
          Loading Practice Session...
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          Preparing interactive code environment
        </p>
      </div>
    );
  }

  if (isCuratedDrill) {
    return (
      <DebugDrillPlayer
        mode={mode}
        challenges={challenges}
        onComplete={handleComplete}
        onExit={handleExit}
      />
    );
  }

  if (emptyMistakes) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 select-none">
        <div className="max-w-md w-full rounded-3xl bg-[#131f24] border-2 border-slate-800 p-8 text-center shadow-2xl flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-10 h-10" strokeWidth={2} />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Mistakes Bank All Clear!
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              You do not have any unresolved bugs right now. Keep practicing with Output Lab or Clean Code challenges!
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full mt-2">
            <button
              type="button"
              onClick={() => router.push("/lesson?mode=debug_tracing")}
              className="w-full py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:translate-y-1 border-b-4 border-sky-700 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Practice Output Lab (+20 XP)</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/debug")}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:translate-y-1 border-b-4 border-slate-950 text-slate-200 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              <span>Back to Debug Lab</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-center select-none gap-4">
        <p className="text-slate-300 font-bold">Lesson not found.</p>
        <button
          type="button"
          onClick={() => router.push(isDebugSession ? "/debug" : "/roadmap")}
          className="px-6 py-3 rounded-2xl bg-sky-500 text-slate-950 font-black text-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <LessonPlayer
      lesson={lesson}
      mode={mode}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-slate-400 font-bold">
          Loading lesson session...
        </div>
      }
    >
      <LessonContentController />
    </Suspense>
  );
}
