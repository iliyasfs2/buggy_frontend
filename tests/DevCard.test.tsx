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

    vi.spyOn(progressApi, "fetchDevHubTalentsApi").mockResolvedValue({
      talents: [
        {
          id: "user_6",
          username: "Alex",
          display_name: "Alex",
          specialty_title: "Backend Developer",
          role_category: "Backend",
          collab_status: "Looking for Teammate",
          bio: "Distributed systems & high-speed Python APIs.",
          tech_stack: ["Python", "FastAPI", "SQL"],
          projects: [],
          social_links: {},
          is_super: true,
          streak: 14,
          bugs_fixed: 32,
          accuracy: 96,
          total_xp: 900,
          mastery_percent: 100,
          courses_mastery: [{ id: "python", title: "Python", shortLabel: "PY", percent: 100, isCompleted: true }],
          is_following: false,
          followers_count: 5,
          is_me: false,
        },
      ],
    });

    vi.spyOn(progressApi, "fetchDevHubSquadsApi").mockResolvedValue({
      squads: [
        {
          id: 1,
          creator_id: "user_6",
          creator_username: "Alex",
          project_title: "Realtime Code Collab CLI",
          my_role: "Backend",
          needed_role: "Frontend",
          min_streak: 5,
          description: "FastAPI WebSocket backend is ready.",
          is_mine: false,
          creator: {
            id: "user_6",
            username: "Alex",
            display_name: "Alex",
            specialty_title: "Backend Developer",
            role_category: "Backend",
            collab_status: "Looking for Teammate",
            bio: "Distributed systems.",
            tech_stack: ["Python", "FastAPI"],
            projects: [],
            social_links: {},
            is_super: true,
            streak: 14,
            bugs_fixed: 32,
            accuracy: 96,
            total_xp: 900,
            mastery_percent: 100,
            courses_mastery: [],
            is_following: false,
            followers_count: 5,
            is_me: false,
          },
        },
      ],
    });

    vi.spyOn(progressApi, "fetchDevHubShowcaseApi").mockResolvedValue({
      projects: [
        {
          id: 10,
          rank: 1,
          creator_id: "user_2",
          creator_username: "ILIYASFS",
          title: "Buggy Platform",
          description: "Gamified platform to learn coding.",
          url: "https://buggy.dev",
          tech_tags: ["JavaScript", "React"],
          boost_count: 48,
          has_boosted: false,
          creator: {
            id: "user_2",
            username: "ILIYASFS",
            display_name: "ILIYASFS",
            specialty_title: "Full-Stack Developer",
            role_category: "Full-Stack",
            collab_status: "Open to Work",
            bio: "Building interactive web apps.",
            tech_stack: ["JavaScript", "React"],
            projects: [],
            social_links: {},
            is_super: true,
            streak: 4,
            bugs_fixed: 12,
            accuracy: 79,
            total_xp: 305,
            mastery_percent: 50,
            courses_mastery: [],
            is_following: false,
            followers_count: 0,
            is_me: true,
          },
        },
      ],
    });

    render(<DevHubPage />);

    expect(screen.getByText("Dev Hub")).toBeInTheDocument();
    expect(
      screen.getByText("Build your profile, find developers, and join cool projects.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /My Dev Card/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Talent Search/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Squads & Showcase/i })).toBeInTheDocument();

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

    fireEvent.click(screen.getByRole("button", { name: /Talent Search/i }));
    await waitFor(() => {
      expect(screen.getByText("Alex")).toBeInTheDocument();
      expect(screen.getByText("SUPER")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /View Dev Card/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Squads & Showcase/i }));
    await waitFor(() => {
      expect(screen.getByText("Realtime Code Collab CLI")).toBeInTheDocument();
      expect(screen.getByText("Have: Backend")).toBeInTheDocument();
      expect(screen.getByText("Need: Frontend")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Project Showcase/i }));
    await waitFor(() => {
      expect(screen.getByText("#1 Project of the Season")).toBeInTheDocument();
      expect(screen.getByText(/Like \(48\)/i)).toBeInTheDocument();
    });
  });
});
