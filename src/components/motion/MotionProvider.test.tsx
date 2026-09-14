import { render, screen } from "@testing-library/react";
import { m } from "motion/react";
import { describe, expect, it } from "vitest";
import { MotionProvider } from "./MotionProvider";

describe("MotionProvider", () => {
  it("renders lazy motion children", () => {
    render(<MotionProvider><m.div data-testid="box">hi</m.div></MotionProvider>);
    expect(screen.getByTestId("box")).toHaveTextContent("hi");
  });
});
