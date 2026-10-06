"use client";

import type { ReactElement } from "react";
import { useState, useCallback, useEffect } from "react";
import type { PathNode, Chapter } from "@/types/roadmap";
import { MOCK_JAVASCRIPT_CHAPTERS } from "@/constants/roadmap";
import { BookOpen } from "lucide-react";
import { ChapterSection } from "./ChapterSection";
import { PathGuidebookModal } from "./PathGuidebookModal";
import { PathSidebar } from "./PathSidebar";
import { getChapterTheme } from "./chapterThemes";

export function PathView(): ReactElement {
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [selectedGuidebookChapter, setSelectedGuidebookChapter] = useState<Chapter | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string>(
    MOCK_JAVASCRIPT_CHAPTERS[0]?.id || ""
  );

  const handleSelectNode = useCallback((node: PathNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  const handleCloseNodeModal = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleStartNode = useCallback((node: PathNode) => {
    setSelectedNode(null);
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
    MOCK_JAVASCRIPT_CHAPTERS.find((c) => c.id === activeChapterId) ||
    MOCK_JAVASCRIPT_CHAPTERS[0];

  const activeTheme = getChapterTheme(activeChapter?.chapterNumber || 1);

  return (
    <div
      className="w-full min-h-screen px-3.5 min-[400px]:px-4 sm:px-6 lg:px-8 pt-2 md:pt-8 lg:pt-10 pb-16 max-w-7xl mx-auto select-none"
      onClick={() => setSelectedNode(null)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 xl:gap-12 items-start">
        <main className="w-full flex flex-col items-center">
          <div className="sticky top-14 md:top-0 z-30 w-full flex flex-col items-center pt-2.5 sm:pt-3 md:pt-6 mb-8">
            <div className="absolute top-0 inset-x-0 h-2.5 sm:h-3 md:h-6 bg-[#101826] pointer-events-none" />
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
                  SECTION 1
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

          {MOCK_JAVASCRIPT_CHAPTERS.map((chapter) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              onSelectNode={handleSelectNode}
              selectedNodeId={selectedNode?.id}
              onStartNode={handleStartNode}
              onClosePopover={handleCloseNodeModal}
            />
          ))}
        </main>

        <div className="hidden lg:block sticky top-24" onClick={(e) => e.stopPropagation()}>
          <PathSidebar />
        </div>
      </div>

      <PathGuidebookModal
        chapter={selectedGuidebookChapter}
        onClose={handleCloseGuidebook}
      />
    </div>
  );
}

