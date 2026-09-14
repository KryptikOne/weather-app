import { render, screen } from "@testing-library/react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { describe, expect, it } from "vitest";
import { baseCardProps } from "@/test/fixtures";
import { sunCard, type SunOptions } from "./definition";
import { SunCard } from "./SunCard";

const opts = sunCard.defaultOptions as SunOptions;
const show = (ui: React.ReactElement) => render(<MotionProvider>{ui}</MotionProvider>);

describe("SunCard", () => {
  it("shows sunrise, sunset, solar noon, both durations, and twilight", () => {
    show(<SunCard {...baseCardProps()} options={opts} />);
    expect(screen.getByText("Sunrise")).toBeInTheDocument();
    expect(screen.getByText("Sunset")).toBeInTheDocument();
    expect(screen.getByText("Solar Noon")).toBeInTheDocument();
    expect(screen.getByText("Total Daylight")).toBeInTheDocument();
    expect(screen.getByTestId("daylight").textContent).toMatch(/^13 hrs \d+ mins$/);
    expect(screen.getByText("Visible Sun")).toBeInTheDocument();
    expect(screen.getByTestId("visible-sun").textContent).toMatch(/^12 hrs \d+ mins$/);
    expect(screen.getByText(/First to Last Light/)).toBeInTheDocument();
    expect(screen.getByTestId("sun-marker")).toBeInTheDocument();
  });

  it("hides twilight, solar noon, and visible sun when turned off", () => {
    const off = { showTwilight: false, showSolarNoon: false, showVisibleSun: false };
    show(<SunCard {...baseCardProps({ options: off })} options={off} />);
    expect(screen.queryByText(/First to Last Light/)).not.toBeInTheDocument();
    expect(screen.queryByText("Solar Noon")).not.toBeInTheDocument();
    expect(screen.queryByText("Visible Sun")).not.toBeInTheDocument();
    expect(screen.queryByTestId("visible-sun")).not.toBeInTheDocument();
    expect(screen.getByText("Total Daylight")).toBeInTheDocument();
  });

  it("shows a skeleton without astronomy data", () => {
    show(<SunCard {...baseCardProps({ astro: undefined, status: "loading" })} options={opts} />);
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
});
