import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DevCard } from "@/components/profile/DevCard";
import { CourseMasterySection } from "@/components/profile/CourseMasterySection";
import DevHubPage from "@/app/dev-hub/page";
import * as progressApi from "@/services/progressApi";

describe("DevCard & CourseMasterySection", () => {
  it("removes Verified badge inside JavaScript mastery box and renders exact progress", () => {
    render(
      <DevCard
        displayName="ILIYASFS"
        username="iliyasfs"
        streakCount={4}
        bugsHunted={12}
        accuracy={79}
        coursesMastery={[
          {
            id: "javascript",
            title: "JavaScript",
            shortLabel: "JS",
            percent: 50,
            isCompleted: false,
          },
        ]}
      />
    );

    expect(screen.queryByText(/verified/i)).not.toBeInTheDocument();
    expect(screen.getAllByText("JavaScript").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("79%")).toBeInTheDocument();
  });

  it("renders Completed • 100% state when a single language track is completed", () => {
    render(
      <CourseMasterySection
        courses={[
          {
            id: "javascript",
            title: "JavaScript",
            shortLabel: "JS",
            percent: 100,
            isCompleted: true,
          },
        ]}
      />
    );

    expect(screen.queryByText(/verified/i)).not.toBeInTheDocument();
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText(/Completed • 100%/i)).toBeInTheDocument();
  });

  it("renders multi-language mastery grid cleanly for 2 and 4 languages with mixed completion", () => {
    const { rerender } = render(
      <CourseMasterySection
        courses={[
          {
            id: "javascript",
            title: "JavaScript",
            shortLabel: "JS",
            percent: 100,
            isCompleted: true,
          },
          {
            id: "python",
            title: "Python",
            shortLabel: "PY",
            percent: 40,
            isCompleted: false,
          },
        ]}
      />
    );

    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();

    rerender(
      <CourseMasterySection
        courses={[
          { id: "javascript", title: "JavaScript", shortLabel: "JS", percent: 100, isCompleted: true },
          { id: "python", title: "Python", shortLabel: "PY", percent: 100, isCompleted: true },
          { id: "typescript", title: "TypeScript", shortLabel: "TS", percent: 60, isCompleted: false },
          { id: "react", title: "React", shortLabel: "React", percent: 20, isCompleted: false },
        ]}
      />
    );

    expect(screen.getByText("JS")).toBeInTheDocument();
    expect(screen.getByText("PY")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
    expect(screen.getAllByText("100%").length).toBe(2);
  });
});

describe("DevHubPage Backend & DB Integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("loads live stats and dev card from backend API and persists edits via updateDevCardApi", async () => {
    vi.spyOn(progressApi, "fetchUserProgress").mockResolvedValue({
      totalXP: 305,
      streak: 6,
      battery: 5,
      bytes: 200,
      active_course: "javascript",
      completed_nodes: ["js-1-1", "js-1-2"],
      unlocked_nodes: ["js-1-1", "js-1-2", "js-1-3"],
      daily_quests_state: [],
    });

    vi.spyOn(progressApi, "fetchDevCardApi").mockResolvedValue({
      is_authenticated: true,
      username: "DBTestedCoder",
      coder_title: "Backend Architect",
      dev_card: {
        specialtyTitle: "Backend Architect",
        collabStatus: "Looking for Teammate",
        bio: "Real bio loaded directly from SQLite.",
        techStack: ["JavaScript", "Python", "FastAPI"],
        projects: [
          {
            id: "db1",
            title: "SQLite Engine",
            desc: "Persisted project from backend.",
            link: "https://github.com/db",
          },
        ],
        githubUrl: "https://github.com/dbtested",
        linkedinUrl: "",
        websiteUrl: "",
        telegramUrl: "",
        email: "db@buggy.dev",
      },
      stats: {
        streak: 6,
        bugs_fixed: 19,
        accuracy: 94,
        mastery_percent: 100,
        completed_nodes_count: 10,
        solved_mistakes_count: 9,
        pending_mistakes_count: 1,
        courses_mastery: [
          { id: "javascript", title: "JavaScript", shortLabel: "JS", percent: 100, isCompleted: true },
          { id: "python", title: "Python", shortLabel: "PY", percent: 50, isCompleted: false },
        ],
      },
      courses_mastery: [
        { id: "javascript", title: "JavaScript", shortLabel: "JS", percent: 100, isCompleted: true },
        { id: "python", title: "Python", shortLabel: "PY", percent: 50, isCompleted: false },
      ],
    });

    const updateSpy = vi.spyOn(progressApi, "updateDevCardApi").mockImplementation(async (payload) => ({
      success: true,
      dev_card: payload,
      coder_title: payload.specialtyTitle,
    }));

    render(<DevHubPage />);

    await waitFor(() => {
      expect(screen.getByText("DBTestedCoder")).toBeInTheDocument();
      expect(screen.getByText("Backend Architect")).toBeInTheDocument();
      expect(screen.getByText("Real bio loaded directly from SQLite.")).toBeInTheDocument();
      expect(screen.getByText("19")).toBeInTheDocument();
      expect(screen.getByText("94%")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
      expect(screen.getByText("50%")).toBeInTheDocument();
    });

    expect(screen.queryByText(/verified/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Edit Card/i }));

    const titleInput = screen.getByPlaceholderText(/Role title/i);
    fireEvent.change(titleInput, { target: { value: "Systems Engineer" } });

    fireEvent.click(screen.getByRole("button", { name: /Save Card/i }));

    await waitFor(() => {
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy.mock.calls[0][0].specialtyTitle).toBe("Systems Engineer");
      expect(screen.getByText("Systems Engineer")).toBeInTheDocument();
    });
  });
});
