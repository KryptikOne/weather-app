import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { baseCardProps, snapshotFixture } from "@/test/fixtures";
import { AirCard } from "./AirCard";
import { airCard, type AirOptions } from "./definition";

const opts = airCard.defaultOptions as AirOptions;

describe("AirCard", () => {
  it("shows the band label and index", () => {
    const props = baseCardProps({ options: opts });
    render(<AirCard {...props} options={opts} />);
    expect(screen.getByRole("heading", { name: "Air Quality" })).toBeInTheDocument();
    expect(screen.getByTestId("aqi-label")).toHaveTextContent(/Good|Fair|Moderate|Poor|Very Poor/);
    expect(screen.getByText(new RegExp(`Index ${props.snapshot!.air!.aqi} of 5`))).toBeInTheDocument();
    expect(screen.queryByTestId("aqi-component")).not.toBeInTheDocument();
  });

  it("lists components when enabled", () => {
    const o = { showComponents: true };
    render(<AirCard {...baseCardProps({ options: o })} options={o} />);
    expect(screen.getAllByTestId("aqi-component")).toHaveLength(8);
    expect(screen.getByText("PM2.5")).toBeInTheDocument();
  });

  it("explains when air data is missing", () => {
    const snap = snapshotFixture();
    snap.air = null;
    render(<AirCard {...baseCardProps({ snapshot: snap, options: opts })} options={opts} />);
    expect(screen.getByText(/isn.t available/i)).toBeInTheDocument();
  });

  it("shows a skeleton while loading", () => {
    render(<AirCard {...baseCardProps({ status: "loading", snapshot: undefined })} options={opts} />);
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
});
