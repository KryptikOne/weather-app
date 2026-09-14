import { fireEvent, render, screen, within } from "@testing-library/react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { describe, expect, it } from "vitest";
import { baseCardProps } from "@/test/fixtures";
import { hourlyCard, type HourlyOptions } from "./definition";
import { HourlyCard } from "./HourlyCard";

const opts = hourlyCard.defaultOptions as HourlyOptions;
const show = (ui: React.ReactElement) => render(<MotionProvider>{ui}</MotionProvider>);

describe("HourlyCard", () => {
  it("renders one column per hour with time labels and the default metric", () => {
    const o = { ...opts, hours: "12" as const };
    show(<HourlyCard {...baseCardProps({ options: o })} options={o} />);
    expect(screen.getByRole("heading", { name: "Hourly Forecast" })).toBeInTheDocument();
    expect(screen.getAllByTestId("hour-label")).toHaveLength(12);
    expect(screen.getAllByRole("img")).toHaveLength(12);
    expect(screen.getByRole("button", { name: "Temperature", pressed: true })).toBeInTheDocument();
    expect(screen.getAllByTestId("strip-value")[0].textContent).toMatch(/^-?\d+°$/);
  });

  it("switches metric when a chip is pressed", () => {
    show(<HourlyCard {...baseCardProps({ options: opts })} options={opts} />);
    fireEvent.click(screen.getByRole("button", { name: "Precip Chance" }));
    expect(screen.getByRole("button", { name: "Precip Chance", pressed: true })).toBeInTheDocument();
    expect(within(screen.getByRole("button", { name: "Precip Chance", pressed: true })).getByTestId("chip-pill")).toBeInTheDocument();
    expect(screen.getAllByTestId("strip-value")[0].textContent).toMatch(/%$/);
    expect(screen.getAllByTestId("strip-bar").length).toBeGreaterThan(0);
  });

  it("only offers the configured chips", () => {
    const o = { ...opts, metrics: ["temp", "windSpeed"], defaultMetric: "windSpeed" };
    show(<HourlyCard {...baseCardProps({ options: o })} options={o} />);
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Wind", pressed: true })).toBeInTheDocument();
  });

  it("shows a skeleton while loading", () => {
    show(<HourlyCard {...baseCardProps({ status: "loading", snapshot: undefined })} options={opts} />);
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
});
