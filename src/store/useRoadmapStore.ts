import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Chapter } from "@/types/roadmap";
import { MOCK_JAVASCRIPT_CHAPTERS } from "@/constants/roadmap";
import type { ProgressData } from "@/services/progressApi";

export interface RoadmapState {
  chapters: Chapter[];
  completeNode: (nodeId: string) => string | null;
  syncProgress: (data: ProgressData) => void;
}

export const useRoadmapStore = create<RoadmapState>()(
  persist(
    (set) => ({
      chapters: MOCK_JAVASCRIPT_CHAPTERS,
      syncProgress: (data: ProgressData) => {
        set((state) => {
          const updated = state.chapters.map((ch) => {
            const newNodes = ch.nodes.map((node) => {
              let newStatus = "locked";
              if (data.completed_nodes.includes(node.id)) {
                newStatus = "completed";
              } else if (data.unlocked_nodes.includes(node.id)) {
                newStatus = "current";
              }
              return { ...node, status: newStatus as "locked" | "current" | "completed" };
            });
            return { ...ch, nodes: newNodes };
          });
          return { chapters: updated };
        });
      },
      completeNode: (nodeId: string) => {
        let nextToUnlockId: string | null = null;
        
        set((state) => {
          const updated = state.chapters.map((ch) => {
            const nodeIndex = ch.nodes.findIndex((n) => n.id === nodeId);
            if (nodeIndex !== -1) {
              const newNodes = [...ch.nodes];
              newNodes[nodeIndex] = { ...newNodes[nodeIndex], status: "completed" };

              if (nodeIndex + 1 < newNodes.length) {
                nextToUnlockId = newNodes[nodeIndex + 1].id;
                if (newNodes[nodeIndex + 1].status === "locked") {
                    newNodes[nodeIndex + 1] = { ...newNodes[nodeIndex + 1], status: "current" };
                }
              }
              return { ...ch, nodes: newNodes };
            }
            return ch;
          });
          return { chapters: updated };
        });

        return nextToUnlockId;
      }
    }),
    {
      name: "buggy-roadmap-storage",
    }
  )
);
