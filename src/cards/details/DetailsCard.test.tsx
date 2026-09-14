import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { baseCardProps } from "@/test/fixtures";
import { detailsCard, type DetailsOptions } from "./definition";
import { DetailsCard } from "./DetailsCard";

const opts = detailsCard.defaultOptions as DetailsOptions;

describe("DetailsCard", () => {
  it("renders one chip per configured metric with a wind direction arrow", () => {
    const props = baseCardProps({ options: opts });
    render(<DetailsCard {...props} options={opts} />);
    expect(screen.getByRole("heading", { name: "Details" })).toBeInTheDocument();
    expect(screen.getAllByTestId("detail-chip")).toHaveLength(opts.metrics.length);
    expect(screen.getByText("Wind")).toBeInTheDocument();
    const arrow = screen.getByTestId("wind-arrow");
    expect(arrow.style.transform).toMatch(/rotate\(\d+deg\)/);
    expect(screen.getByTestId("wind-compass").textContent).toMatch(/^[NESW]{1,2}$/);
  });

  it("respects the metric order and drops unknown keys", () => {
    const o = { metrics: ["uvi", "bogus", "humidity"] };
    render(<DetailsCard {...baseCardProps({ options: o })} options={o} />);
    const labels = screen.getAllByTestId("detail-chip").map((el) => el.querySelector("[data-label]")?.textContent);
    expect(labels).toEqual(["UV Index", "Humidity"]);
  });

  it("uses four columns on desktop", () => {
    render(<DetailsCard {...baseCardProps({ options: opts, breakpoint: "desktop" })} options={opts} />);
    expect(screen.getByTestId("detail-grid")).toHaveAttribute("data-cols", "4");
  });

  it("shows a skeleton while loading", () => {
    render(<DetailsCard {...baseCardProps({ status: "loading", snapshot: undefined })} options={opts} />);
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
});
