"use client";

import type { ReactElement } from "react";
import type { Chapter, PathNode } from "@/types/roadmap";
import { ChapterHeader } from "./ChapterHeader";
import { PathNodeButton } from "./PathNodeButton";

export interface ChapterSectionProps {
  chapter: Chapter;
  onSelectNode: (node: PathNode) => void;
  selectedNodeId?: string;
  onOpenGuidebook?: (chapter: Chapter) => void;
}

export function ChapterSection({
  chapter,
  onSelectNode,
  selectedNodeId,
  onOpenGuidebook
}: ChapterSectionProps): ReactElement {
  return (
    <section aria-label={chapter.title} className="w-full flex flex-col items-center mb-16">
      <ChapterHeader chapter={chapter} onOpenGuidebook={onOpenGuidebook} />

      <div className="relative w-full max-w-md flex flex-col items-center">
        {chapter.nodes.map((node, index) => (
          <div key={node.id} className="relative w-full flex flex-col items-center">
            {index > 0 && (
              <div className="w-1.5 h-6 rounded-full bg-slate-800/80 my-[-6px] z-0" />
            )}
            <PathNodeButton
              node={node}
              index={index}
              onSelectNode={onSelectNode}
              isSelected={selectedNodeId === node.id}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
