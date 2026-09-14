import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { baseCardProps, snapshotFixture } from "@/test/fixtures";
import { precipCard, type PrecipOptions } from "./definition";
import { PrecipCard } from "./PrecipCard";

const opts = precipCard.defaultOptions as PrecipOptions;

function wetSnapshot() {
  const snap = snapshotFixture();
  snap.minutely = Array.from({ length: 60 }, (_, i) => ({ time: `2026-09-13T17:${String(i).padStart(2, "0")}:00Z`, amount: i > 20 && i < 40 ? 0.6 : 0 }));
  return snap;
}
function drySnapshot() {
  const snap = snapshotFixture();
  snap.minutely = snap.minutely.map((m) => ({ ...m, amount: 0 }));
  return snap;
}

describe("PrecipCard", () => {
  it("draws sixty bars when rain is coming", () => {
    render(<PrecipCard {...baseCardProps({ snapshot: wetSnapshot(), options: opts })} options={opts} />);
    expect(screen.getByRole("heading", { name: "Next Hour" })).toBeInTheDocument();
    expect(screen.getAllByTestId("minute-bar")).toHaveLength(60);
    expect(screen.getByText("Now")).toBeInTheDocument();
  });

  it("shows the dry message when nothing is expected", () => {
    render(<PrecipCard {...baseCardProps({ snapshot: drySnapshot(), options: opts })} options={opts} />);
    expect(screen.getByText(/no precipitation expected/i)).toBeInTheDocument();
  });

  it("explains when minute data is unavailable", () => {
    const snap = snapshotFixture();
    snap.minutely = [];
    render(<PrecipCard {...baseCardProps({ snapshot: snap, options: opts })} options={opts} />);
    expect(screen.getByText(/isn.t available/i)).toBeInTheDocument();
  });

  it("hides itself when dry and asked to", () => {
    const hide = { hideWhenDry: true };
    expect(precipCard.isHidden!(baseCardProps({ snapshot: drySnapshot(), options: hide }))).toBe(true);
    expect(precipCard.isHidden!(baseCardProps({ snapshot: wetSnapshot(), options: hide }))).toBe(false);
    expect(precipCard.isHidden!(baseCardProps({ snapshot: drySnapshot(), options: opts }))).toBe(false);
  });
});
