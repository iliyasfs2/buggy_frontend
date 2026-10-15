"use client";

import type { ReactElement } from "react";
import type { PathNode } from "@/types/roadmap";
import { LessonNode, type NodePalette } from "./LessonNode";
import { NodeActionPopover } from "./NodeActionPopover";

export interface PathNodeButtonProps {
  node: PathNode;
  index: number;
  chapterIndex?: number;
  onSelectNode: (node: PathNode) => void;
  isSelected?: boolean;
  palette?: NodePalette;
  isUnlocking?: boolean;
  onStartNode?: (node: PathNode) => void;
  onClose?: () => void;
}

const LEFT_CHAPTER_OFFSETS = [-30, -65, -70, -40, 0];
const RIGHT_CHAPTER_OFFSETS = [30, 65, 70, 40, 0];

export function PathNodeButton({
  node,
  index,
  chapterIndex = 0,
  onSelectNode,
  isSelected = false,
  palette,
  isUnlocking = false,
  onStartNode,
  onClose
}: PathNodeButtonProps): ReactElement {
  const isRightChapter = chapterIndex % 2 === 1;
  const offsets = isRightChapter ? RIGHT_CHAPTER_OFFSETS : LEFT_CHAPTER_OFFSETS;
  const horizontalOffset = offsets[index % offsets.length];

  const handleNodeClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onSelectNode(node);
  };

  return (
    <div
      className={`relative flex flex-col items-center select-none my-[22px] sm:my-[24px] ${
        isSelected ? "z-50" : "z-10"
      }`}
      style={{
        transform: `translate3d(${horizontalOffset}px, 0, 0)`
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <LessonNode
        id={node.id}
        order={node.order}
        status={node.status}
        palette={palette}
        isUnlocking={isUnlocking}
        isSelected={isSelected}
        onClick={handleNodeClick}
        ariaLabel={`${node.title} - ${node.type} (${node.status})`}
      />

      {isSelected && (
        <NodeActionPopover
          node={node}
          palette={palette}
          onClose={onClose || (() => onSelectNode(node))}
          onStartNode={onStartNode}
        />
      )}
    </div>
  );
}
