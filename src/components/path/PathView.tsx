"use client";

import type { ReactElement } from "react";
import { useState, useCallback, useEffect } from "react";
import type { PathNode, Chapter } from "@/types/roadmap";
import { MOCK_JAVASCRIPT_CHAPTERS } from "@/constants/roadmap";
import { BookOpen, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEffects } from "@/utils/soundEffects";
import { ChapterSection } from "./ChapterSection";
import { PathGuidebookModal } from "./PathGuidebookModal";
import { PathSidebar } from "./PathSidebar";
import { DesktopMetricBar } from "@/components/layout/DesktopMetricBar";
import { getChapterTheme } from "./chapterThemes";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";
import { LESSON_JS_1_1 } from "@/data/mock/lessons/js-1-1";
import { LESSON_JS_1_2 } from "@/data/mock/lessons/js-1-2";
import { LESSON_JS_1_3 } from "@/data/mock/lessons/js-1-3";
import { LESSON_JS_1_4 } from "@/data/mock/lessons/js-1-4";
import { LESSON_JS_1_5 } from "@/data/mock/lessons/js-1-5";

const getLessonContent = (id: string) => {
  if (id === "js-1-2") return LESSON_JS_1_2;
  if (id === "js-1-3") return LESSON_JS_1_3;
  if (id === "js-1-4") return LESSON_JS_1_4;
  if (id === "js-1-5") return LESSON_JS_1_5;
  return LESSON_JS_1_1;
};
import { useNavStore } from "@/store/useNavStore";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { fetchUserProgress } from "@/services/progressApi";

export function PathView(): ReactElement {
  const { chapters, completeNode, syncProgress } = useRoadmapStore();
  const syncNav = useNavStore((state) => state.syncNav);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);

  useEffect(() => {
    fetchUserProgress()
      .then((data) => {
        syncProgress(data);
        syncNav(data);
      })
      .catch(err => console.error("Failed to sync progress:", err));
  }, [syncProgress, syncNav]);
  const [selectedGuidebookChapter, setSelectedGuidebookChapter] = useState<Chapter | null>(null);
  const [activeLessonNode, setActiveLessonNode] = useState<PathNode | null>(null);
  const [unlockingNodeId, setUnlockingNodeId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string>(
    MOCK_JAVASCRIPT_CHAPTERS[0]?.id || ""
  );
  const [streakCelebration, setStreakCelebration] = useState<{
    open: boolean;
    streak: number;
  } | null>(null);

  const handleSelectNode = useCallback((node: PathNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const handleCloseNodeModal = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleStartNode = useCallback((node: PathNode) => {
    setSelectedNode(null);
    setActiveLessonNode(node);
  }, []);

  const handleCompleteLesson = useCallback((totalXp: number) => {
    const completedId = activeLessonNode?.id || "js-1-1";
    const nextToUnlockId = completeNode(completedId);
    if (nextToUnlockId) {
      setUnlockingNodeId(nextToUnlockId);
      setTimeout(() => {
        setUnlockingNodeId(null);
      }, 1500);
    }
    setActiveLessonNode(null);
  }, [activeLessonNode, completeNode]);

  const handleExitLesson = useCallback(() => {
    setActiveLessonNode(null);
  }, []);

  const handleOpenGuidebook = useCallback((chapter: Chapter) => {
    setSelectedGuidebookChapter(chapter);
  }, []);

  const handleCloseGuidebook = useCallback(() => {
    setSelectedGuidebookChapter(null);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-chapter-id");
            if (id) {
              setActiveChapterId(id);
            }
          }
        }
      },
      {
        rootMargin: "-80px 0px -55% 0px",
        threshold: 0.1
      }
    );

    const sections = document.querySelectorAll("[data-chapter-id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const activeChapter =
    chapters.find((c) => c.id === activeChapterId) ||
    chapters[0];

  const activeTheme = getChapterTheme(activeChapter?.chapterNumber || 1);

  return (
    <div
      className="w-full min-h-screen pl-4 sm:pl-10 md:pl-16 lg:pl-24 xl:pl-32 pr-4 sm:pr-8 lg:pr-10 py-6 sm:py-8 select-none"
      onClick={() => setSelectedNode(null)}
    >
      <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-14">
        <main className="w-full max-w-xl xl:max-w-2xl flex flex-col items-center shrink-0">
          <div className="hidden md:flex lg:hidden justify-end w-full mb-3">
            <DesktopMetricBar inline />
          </div>
          <div className="sticky top-14 md:top-0 z-30 w-full flex flex-col items-center pt-2.5 sm:pt-3 md:pt-4 pb-2 mb-8 bg-[#101826]">
            <div className="absolute -top-24 inset-x-0 h-24 bg-[#101826] pointer-events-none" />
            <div
              className="relative w-full max-w-[560px] lg:max-w-[620px] rounded-2xl py-3 px-4 sm:py-3.5 sm:px-6 border-b-[5px] transition-colors duration-300 flex items-center justify-between gap-3 sm:gap-4 shadow-[0_12px_28px_rgba(0,0,0,0.35)] select-none"
              style={{
                backgroundColor: activeTheme.cardBg,
                borderColor: activeTheme.cardBorder,
                color: "#ffffff"
              }}
            >
              <div className="flex-1 min-w-0">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider block text-white/85">
                  SECTION {activeChapter?.chapterNumber || 1}
                </span>
                <h2 className="text-base sm:text-lg md:text-xl font-black leading-tight text-white mt-0.5 truncate">
                  {activeChapter?.title}
                </h2>
                {activeChapter?.description && (
                  <p className="text-xs sm:text-sm font-bold text-white/90 mt-0.5 truncate">
                    {activeChapter.description}
                  </p>
                )}
              </div>

              {activeChapter && (
                <button
                  type="button"
                  onClick={() => handleOpenGuidebook(activeChapter)}
                  aria-label={`Guidebook for ${activeChapter.title}`}
                  className="px-3 sm:px-3.5 py-2 rounded-xl border-2 border-b-4 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all duration-150 active:translate-y-1 active:border-b-2 cursor-pointer shrink-0 text-white"
                  style={{
                    backgroundColor: activeTheme.btnBg,
                    borderColor: activeTheme.btnBorder
                  }}
                >
                  <BookOpen className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden min-[380px]:inline">GUIDEBOOK</span>
                  <span className="inline min-[380px]:hidden">GUIDE</span>
                </button>
              )}
            </div>
          </div>

          {chapters.map((chapter, chapterIndex) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              chapterIndex={chapterIndex}
              onSelectNode={handleSelectNode}
              selectedNodeId={selectedNode?.id}
              unlockingNodeId={unlockingNodeId || undefined}
              onStartNode={handleStartNode}
              onClosePopover={handleCloseNodeModal}
            />
          ))}
        </main>

        <div className="hidden lg:flex flex-1 flex-col items-center gap-6 sticky top-8" onClick={(e) => e.stopPropagation()}>
          <DesktopMetricBar inline />
          <div className="w-full max-w-[360px]">
            <PathSidebar />
          </div>
        </div>
      </div>

      <PathGuidebookModal
        chapter={selectedGuidebookChapter}
        onClose={handleCloseGuidebook}
      />

      {activeLessonNode && (
        <LessonPlayer
          lesson={getLessonContent(activeLessonNode.id)}
          onComplete={handleCompleteLesson}
          onExit={handleExitLesson}
        />
      )}

      <AnimatePresence>
        {streakCelebration?.open && (
          <div className="fixed inset-0 z-[150] bg-[#0f172a]/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-orange-500/40 p-6 sm:p-8 text-center shadow-2xl flex flex-col items-center gap-5 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent pointer-events-none" />

              <div className="w-24 h-24 rounded-3xl bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center relative shadow-inner">
                <Flame className="w-14 h-14 text-orange-400 fill-orange-400 drop-shadow-[0_0_25px_rgba(249,115,22,0.9)] animate-pulse" />
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-lg border border-orange-300">
                  +1 🔥
                </span>
              </div>

              <div className="flex flex-col gap-1.5 z-10">
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {streakCelebration.streak} Day Streak!
                </h3>
                <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-xs">
                  Today&apos;s streak is officially secured! Practice again tomorrow to keep your flame burning.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEffects.playSoftClick();
                  setStreakCelebration(null);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-orange-500 hover:bg-orange-400 active:translate-y-1 border-b-4 border-orange-700 active:border-b-0 text-slate-950 font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg z-10"
              >
                Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
