"use client";

import type { ReactElement } from "react";
import type { Chapter, PathNode } from "@/types/roadmap";
import { PathNodeButton } from "./PathNodeButton";
import { getChapterTheme } from "./chapterThemes";

export interface ChapterSectionProps {
  chapter: Chapter;
  onSelectNode: (node: PathNode) => void;
  selectedNodeId?: string;
  onStartNode?: (node: PathNode) => void;
  onClosePopover?: () => void;
}

export function ChapterSection({
  chapter,
  onSelectNode,
  selectedNodeId,
  onStartNode,
  onClosePopover
}: ChapterSectionProps): ReactElement {
  const theme = getChapterTheme(chapter.chapterNumber);

  return (
    <section
      data-chapter-id={chapter.id}
      aria-label={chapter.title}
      className="w-full flex flex-col items-center mb-16 pt-2"
    >
      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {chapter.nodes.map((node, index) => (
          <div key={node.id} className="relative w-full flex flex-col items-center">
            <PathNodeButton
              node={node}
              index={index}
              palette={theme.nodePalette}
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


