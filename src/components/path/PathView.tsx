"use client";

import type { ReactElement } from "react";
import { useState, useCallback } from "react";
import type { PathNode, Chapter } from "@/types/roadmap";
import { MOCK_JAVASCRIPT_CHAPTERS } from "@/constants/roadmap";
import { ChapterSection } from "./ChapterSection";
import { NodeActionModal } from "./NodeActionModal";
import { PathGuidebookModal } from "./PathGuidebookModal";
import { PathSidebar } from "./PathSidebar";
import { useNavStore, selectCurrentTrack } from "@/store/useNavStore";

export function PathView(): ReactElement {
  const currentTrack = useNavStore(selectCurrentTrack);
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [selectedGuidebookChapter, setSelectedGuidebookChapter] = useState<Chapter | null>(null);

  const handleSelectNode = useCallback((node: PathNode) => {
    setSelectedNode(node);
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

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto select-none">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-8 xl:gap-12 items-start">
        <main className="w-full flex flex-col items-center">
          {MOCK_JAVASCRIPT_CHAPTERS.map((chapter) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              onSelectNode={handleSelectNode}
              selectedNodeId={selectedNode?.id}
              onOpenGuidebook={handleOpenGuidebook}
            />
          ))}
        </main>

        <div className="hidden lg:block sticky top-20">
          <PathSidebar currentTrack={currentTrack} />
        </div>
      </div>

      <NodeActionModal
        node={selectedNode}
        onClose={handleCloseNodeModal}
        onStartNode={handleStartNode}
      />

      <PathGuidebookModal
        chapter={selectedGuidebookChapter}
        onClose={handleCloseGuidebook}
      />
    </div>
  );
}
