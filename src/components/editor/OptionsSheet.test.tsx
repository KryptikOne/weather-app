import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { REGISTRY } from "@/cards/registry";
import { OptionsSheet } from "./OptionsSheet";

describe("OptionsSheet", () => {
  it("renders one input per field and reports merged options", () => {
    const onChange = vi.fn();
    const instance = { id: "s1", type: "sun", options: { ...REGISTRY.sun.defaultOptions } };
    render(<OptionsSheet open onOpenChange={() => {}} instance={instance} def={REGISTRY.sun} onChange={onChange} />);
    expect(screen.getByText("Sun options")).toBeInTheDocument();
    expect(screen.getAllByRole("switch")).toHaveLength(3);
    fireEvent.click(screen.getByRole("switch", { name: "Show solar noon" }));
    expect(onChange).toHaveBeenCalledWith("s1", { showTwilight: true, showSolarNoon: false, showVisibleSun: true });
  });

  it("says when a card has no options", () => {
    const def = { ...REGISTRY.sun, fields: [] };
    render(<OptionsSheet open onOpenChange={() => {}} instance={{ id: "x", type: "sun", options: {} }} def={def} onChange={() => {}} />);
    expect(screen.getByText(/no options/i)).toBeInTheDocument();
  });
});
