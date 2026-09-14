import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { baseCardProps, snapshotFixture } from "@/test/fixtures";
import { AlertsCard } from "./AlertsCard";
import { alertsCard, type AlertsOptions } from "./definition";

const opts = alertsCard.defaultOptions as AlertsOptions;

function alertSnapshot() {
  const snap = snapshotFixture();
  snap.alerts = [{
    sender: "NWS Chicago",
    event: "Severe Thunderstorm Watch",
    start: "2026-09-13T20:00:00Z",
    end: "2026-09-14T02:00:00Z",
    description: "Storms capable of damaging winds are possible this evening.",
    tags: ["Thunderstorm"],
  }];
  return snap;
}

describe("AlertsCard", () => {
  it("lists each alert with its sender, window, and expandable description", () => {
    render(<AlertsCard {...baseCardProps({ snapshot: alertSnapshot(), options: opts })} options={opts} />);
    expect(screen.getByRole("heading", { name: "Alerts" })).toBeInTheDocument();
    expect(screen.getByText("Severe Thunderstorm Watch")).toBeInTheDocument();
    expect(screen.getByText("NWS Chicago")).toBeInTheDocument();
    expect(screen.getByText(/Sep 13, 3:00 PM/)).toBeInTheDocument();
    expect(screen.getByText(/damaging winds/)).toBeInTheDocument();
    expect(screen.getAllByTestId("alert")).toHaveLength(1);
  });

  it("says so when there are no alerts", () => {
    render(<AlertsCard {...baseCardProps({ options: opts })} options={opts} />);
    expect(screen.getByText(/no active alerts/i)).toBeInTheDocument();
  });

  it("hides itself unless there are alerts or it is pinned", () => {
    expect(alertsCard.isHidden!(baseCardProps({ options: opts }))).toBe(true);
    expect(alertsCard.isHidden!(baseCardProps({ snapshot: alertSnapshot(), options: opts }))).toBe(false);
    expect(alertsCard.isHidden!(baseCardProps({ options: { alwaysShow: true } }))).toBe(false);
    expect(alertsCard.isHidden!(baseCardProps({ snapshot: undefined, status: "loading", options: opts }))).toBe(true);
  });
});
