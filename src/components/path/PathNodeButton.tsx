"use client";

import type { ReactElement } from "react";
import type { PathNode } from "@/types/roadmap";
import { LessonNode, type NodePalette } from "./LessonNode";
import { NodeActionPopover } from "./NodeActionPopover";

export interface PathNodeButtonProps {
  node: PathNode;
  index: number;
  onSelectNode: (node: PathNode) => void;
  isSelected?: boolean;
  palette?: NodePalette;
  isUnlocking?: boolean;
  onStartNode?: (node: PathNode) => void;
  onClose?: () => void;
}

const WINDING_OFFSETS = [0, -45, -70, -45, 0, 45, 70, 45];

export function PathNodeButton({
  node,
  index,
  onSelectNode,
  isSelected = false,
  palette,
  isUnlocking = false,
  onStartNode,
  onClose
}: PathNodeButtonProps): ReactElement {
  const horizontalOffset = WINDING_OFFSETS[index % WINDING_OFFSETS.length];

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
