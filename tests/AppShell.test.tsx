import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppShell } from "@/components/layout/AppShell";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { StatBadge } from "@/components/shared/StatBadge";
import { TrackPill } from "@/components/shared/TrackPill";
import { useNavStore } from "@/store/useNavStore";

describe("useNavStore", () => {
  beforeEach(() => {
    useNavStore.setState({
      activeTab: "setup",
      streakCount: 14,
      byteBalance: 1250,
      currentTrack: "JS & React"
    });
  });

  it("initializes with expected default values", () => {
    const state = useNavStore.getState();
    expect(state.activeTab).toBe("setup");
    expect(state.streakCount).toBe(14);
    expect(state.byteBalance).toBe(1250);
    expect(state.currentTrack).toBe("JS & React");
  });

  it("updates active tab accurately", () => {
    const { setActiveTab } = useNavStore.getState();
    setActiveTab("debug");
    expect(useNavStore.getState().activeTab).toBe("debug");
  });

  it("updates current track accurately", () => {
    const { setTrack } = useNavStore.getState();
    setTrack("Python Core");
    expect(useNavStore.getState().currentTrack).toBe("Python Core");
  });
});

describe("DesktopSidebar", () => {
  beforeEach(() => {
    useNavStore.setState({
      activeTab: "setup",
      streakCount: 14,
      byteBalance: 1250,
      currentTrack: "JS & React"
    });
  });

  it("renders navigation buttons and brand title", () => {
    render(<DesktopSidebar />);
    expect(screen.getByText("Buggy")).toBeInTheDocument();
    expect(screen.getByText("JS & React")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Path" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Debug" })).toBeInTheDocument();
  });

  it("switches active tab when navigation item is clicked", () => {
    render(<DesktopSidebar />);
    const debugButton = screen.getByRole("button", { name: "Debug" });
    fireEvent.click(debugButton);
    expect(useNavStore.getState().activeTab).toBe("debug");
  });
});

describe("MobileHeader", () => {
  beforeEach(() => {
    useNavStore.setState({
      activeTab: "setup",
      streakCount: 20,
      byteBalance: 3400,
      currentTrack: "JS & React"
    });
  });

  it("renders streak and byte balance correctly", () => {
    render(<MobileHeader />);
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("3,400")).toBeInTheDocument();
  });
});

describe("MobileBottomNav", () => {
  beforeEach(() => {
    useNavStore.setState({
      activeTab: "setup",
      streakCount: 14,
      byteBalance: 1250,
      currentTrack: "JS & React"
    });
  });

  it("renders all bottom navigation items", () => {
    render(<MobileBottomNav />);
    expect(screen.getByRole("button", { name: "Setup" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Debug" })).toBeInTheDocument();
  });

  it("triggers tab switch on item click", () => {
    render(<MobileBottomNav />);
    const pathButton = screen.getByRole("button", { name: "Path" });
    fireEvent.click(pathButton);
    expect(useNavStore.getState().activeTab).toBe("path");
  });
});

describe("Shared Atoms", () => {
  it("renders StatBadge with streak accessibility label and formatted number", () => {
    render(<StatBadge variant="streak" value={42} />);
    expect(screen.getByLabelText("Streak: 42 days")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders StatBadge with byte balance formatting", () => {
    render(<StatBadge variant="byte" value={10500} />);
    expect(screen.getByLabelText("Balance: 10,500 bytes")).toBeInTheDocument();
    expect(screen.getByText("10,500")).toBeInTheDocument();
  });

  it("renders TrackPill and fires onSwitch callback", () => {
    let clicked = false;
    render(<TrackPill track="TypeScript Pro" onSwitch={() => { clicked = true; }} />);
    const pill = screen.getByRole("button", { name: "Switch active track" });
    expect(pill).toHaveTextContent("TypeScript Pro");
    fireEvent.click(pill);
    expect(clicked).toBe(true);
  });
});

describe("AppShell", () => {
  it("renders children inside main landmark", () => {
    render(
      <AppShell>
        <div data-testid="test-content">Workspace Content</div>
      </AppShell>
    );
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Workspace Content")).toBeInTheDocument();
  });
});
