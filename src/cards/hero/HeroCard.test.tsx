import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { baseCardProps, snapshotFixture } from "@/test/fixtures";
import { heroCard, type HeroOptions } from "./definition";
import { HeroCard } from "./HeroCard";

const opts = heroCard.defaultOptions as HeroOptions;

function nightSnapshot() {
  const snap = snapshotFixture();
  snap.current = { ...snap.current, condition: { ...snap.current.condition, isNight: true } };
  return snap;
}

describe("HeroCard", () => {
  it("renders the temperature, feels-like, condition, and location without a card header", () => {
    render(<HeroCard {...baseCardProps({ options: opts, breakpoint: "desktop" })} options={opts} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.getByTestId("hero-temp").textContent).toMatch(/^-?\d+°$/);
    expect(screen.getByText(/^Feels -?\d+°$/)).toBeInTheDocument();
    expect(screen.getByText("Downers Grove")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("hides feels-like and condition text when turned off", () => {
    const off = { showFeelsLike: false, showConditionText: false };
    const props = baseCardProps({ options: off, breakpoint: "desktop" });
    render(<HeroCard {...props} options={off} />);
    expect(screen.queryByText(/^Feels/)).not.toBeInTheDocument();
    expect(screen.queryByText(props.snapshot!.current.condition.label)).not.toBeInTheDocument();
  });

  it("draws stars at night", () => {
    render(<HeroCard {...baseCardProps({ snapshot: nightSnapshot(), options: opts, breakpoint: "desktop" })} options={opts} />);
    expect(screen.getByTestId("hero")).toHaveAttribute("data-night", "true");
    expect(screen.getByTestId("stars")).toBeInTheDocument();
  });

  it("shows a skeleton while loading", () => {
    render(<HeroCard {...baseCardProps({ status: "loading", snapshot: undefined, breakpoint: "desktop" })} options={opts} />);
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
});
