import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { baseCardProps } from "@/test/fixtures";
import { moonCard, type MoonOptions } from "./definition";
import { MoonCard } from "./MoonCard";

const opts = moonCard.defaultOptions as MoonOptions;

describe("MoonCard", () => {
  it("shows the phase, illumination, rise and set, and four upcoming phases", () => {
    const props = baseCardProps({ options: opts });
    render(<MoonCard {...props} options={opts} />);
    expect(screen.getByRole("heading", { name: "Moon" })).toBeInTheDocument();
    expect(screen.getByText(props.astro!.moon.phaseName)).toBeInTheDocument();
    expect(screen.getByText(/^Illumination \d+%$/)).toBeInTheDocument();
    expect(screen.getByText(/^Moonrise/)).toBeInTheDocument();
    expect(screen.getByText(/^Moonset/)).toBeInTheDocument();
    expect(screen.getAllByTestId("upcoming-phase")).toHaveLength(4);
    expect(screen.getByTestId("moon-disc")).toBeInTheDocument();
  });

  it("limits upcoming phases and hides rise and set when asked", () => {
    const o = { upcomingPhases: 2, showRiseSet: false };
    render(<MoonCard {...baseCardProps({ options: o })} options={o} />);
    expect(screen.getAllByTestId("upcoming-phase")).toHaveLength(2);
    expect(screen.queryByText(/^Moonrise/)).not.toBeInTheDocument();
  });

  it("shows a skeleton without astronomy data", () => {
    render(<MoonCard {...baseCardProps({ astro: undefined, status: "loading" })} options={opts} />);
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
});
