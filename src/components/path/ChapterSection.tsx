"use client";

import type { ReactElement } from "react";
import type { Chapter, PathNode } from "@/types/roadmap";
import { PathNodeButton } from "./PathNodeButton";
import { getChapterTheme } from "./chapterThemes";

export interface ChapterSectionProps {
  chapter: Chapter;
  onSelectNode: (node: PathNode) => void;
  selectedNodeId?: string;
  unlockingNodeId?: string;
  onStartNode?: (node: PathNode) => void;
  onClosePopover?: () => void;
}

export function ChapterSection({
  chapter,
  onSelectNode,
  selectedNodeId,
  unlockingNodeId,
  onStartNode,
  onClosePopover
}: ChapterSectionProps): ReactElement {
  const theme = getChapterTheme(chapter.chapterNumber);
  const isActive = chapter.nodes.some((node) => node.id === selectedNodeId);
  

  return (
    <section
      data-chapter-id={chapter.id}
      aria-label={chapter.title}
      className="w-full flex flex-col items-center pb-12"
    >
      {}
      <div className={`w-full max-w-md mx-auto px-4 flex items-center justify-between gap-4 z-10 relative ${chapter.chapterNumber === 1 ? 'mt-4 mb-8' : 'my-12'}`}>
        {chapter.chapterNumber > 1 ? (
          <div className="h-[2px] flex-1 bg-slate-800 rounded-full" />
        ) : (
          <div className="h-[2px] flex-1" />
        )}
        
        <div className="text-sm sm:text-base font-bold text-slate-500 tracking-wide">
          {chapter.title}
        </div>

        {chapter.chapterNumber > 1 ? (
          <div className="h-[2px] flex-1 bg-slate-800 rounded-full" />
        ) : (
          <div className="h-[2px] flex-1" />
        )}
      </div>

      <div
        className={`relative w-full max-w-md flex flex-col items-center ${
          isActive ? "z-20" : "z-10"
        }`}
      >
        {chapter.nodes.map((node, index) => (
          <div
            key={node.id}
            className={`relative w-full flex flex-col items-center ${
              selectedNodeId === node.id ? "z-50" : "z-0"
            }`}
          >
            <PathNodeButton
              node={node}
              index={index}
              palette={theme.nodePalette}
              isUnlocking={node.id === unlockingNodeId}
              onSelectNode={onSelectNode}
              isSelected={selectedNodeId === node.id}
              onStartNode={onStartNode}
              onClose={onClosePopover}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
