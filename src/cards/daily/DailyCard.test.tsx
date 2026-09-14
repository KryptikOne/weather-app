import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { baseCardProps, snapshotFixture } from "@/test/fixtures";
import { DailyCard } from "./DailyCard";
import { dailyCard, type DailyOptions } from "./definition";

const opts = dailyCard.defaultOptions as DailyOptions;

function wetSnapshot() {
  const snap = snapshotFixture();
  snap.daily[0] = { ...snap.daily[0], precipChance: 0.9 };
  return snap;
}

describe("DailyCard", () => {
  it("renders seven rows by default with low, bar, high, and today's marker", () => {
    render(<DailyCard {...baseCardProps({ options: opts })} options={opts} />);
    expect(screen.getByRole("heading", { name: "Daily Forecast" })).toBeInTheDocument();
    expect(screen.getAllByTestId("daily-row")).toHaveLength(7);
    expect(screen.getByTestId("today-marker")).toBeInTheDocument();
    expect(screen.getAllByTestId("daily-low")[0].textContent).toMatch(/^-?\d+°$/);
    expect(screen.getAllByTestId("daily-high")[0].textContent).toMatch(/^-?\d+°$/);
  });

  it("shows eight rows when asked and hides the marker when off", () => {
    const o = { ...opts, days: "8" as const, showTodayMarker: false };
    render(<DailyCard {...baseCardProps({ options: o })} options={o} />);
    expect(screen.getAllByTestId("daily-row")).toHaveLength(8);
    expect(screen.queryByTestId("today-marker")).not.toBeInTheDocument();
  });

  it("shows precipitation chance only when enabled and likely", () => {
    const snapshot = wetSnapshot();
    const { unmount } = render(<DailyCard {...baseCardProps({ snapshot, options: opts })} options={opts} />);
    expect(screen.getAllByTestId("precip-chance")[0]).toHaveTextContent("90%");
    unmount();
    const off = { ...opts, showPrecipChance: false };
    render(<DailyCard {...baseCardProps({ snapshot, options: off })} options={off} />);
    expect(screen.queryByTestId("precip-chance")).not.toBeInTheDocument();
  });

  it("shows a skeleton while loading", () => {
    render(<DailyCard {...baseCardProps({ status: "loading", snapshot: undefined })} options={opts} />);
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
});
