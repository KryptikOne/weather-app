import { render, screen } from "@testing-library/react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { describe, expect, it } from "vitest";
import { baseCardProps } from "@/test/fixtures";
import { CurrentCard } from "./CurrentCard";
import { currentCard, type CurrentOptions } from "./definition";

const opts = currentCard.defaultOptions as CurrentOptions;
const show = (ui: React.ReactElement) => render(<MotionProvider>{ui}</MotionProvider>);

describe("CurrentCard", () => {
  it.each(["phone", "desktop"] as const)("renders temperature, condition, and chips on %s", (breakpoint) => {
    const props = baseCardProps({ options: opts, breakpoint });
    show(<CurrentCard {...props} options={opts} />);
    expect(screen.getByRole("heading", { name: "Current Conditions" })).toBeInTheDocument();
    expect(screen.getByTestId("current-temp").textContent).toMatch(/^-?\d+°$/);
    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", expect.stringContaining("/icons/weather/"));
  });

  it("hides the icon when the option is off", () => {
    const props = baseCardProps({ options: { ...opts, showIcon: false } });
    show(<CurrentCard {...props} options={{ ...opts, showIcon: false }} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows a skeleton while loading", () => {
    const props = baseCardProps({ status: "loading", snapshot: undefined });
    show(<CurrentCard {...props} options={opts} />);
    expect(screen.getByTestId("card-skeleton")).toBeInTheDocument();
  });
});
