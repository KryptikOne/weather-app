import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "./MotionProvider";
import { AnimatedNumber } from "./AnimatedNumber";

const fmt = (v: number) => `${Math.round(v)}°`;

describe("AnimatedNumber", () => {
  it("shows the value immediately and settles on a new value", async () => {
    const { rerender } = render(<MotionProvider><AnimatedNumber value={20} format={fmt} duration={0.05} testId="n" /></MotionProvider>);
    expect(screen.getByTestId("n")).toHaveTextContent("20°");
    rerender(<MotionProvider><AnimatedNumber value={25} format={fmt} duration={0.05} testId="n" /></MotionProvider>);
    await waitFor(() => expect(screen.getByTestId("n")).toHaveTextContent("25°"));
  });
});
