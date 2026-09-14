import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { REGISTRY } from "@/cards/registry";
import { CardControls } from "./CardControls";

const instance = { id: "h1", type: "hourly", options: {}, span: { cols: 8, rows: 1 } };

describe("CardControls", () => {
  it("offers drag, options, remove, and size steppers on desktop", () => {
    const onRemove = vi.fn(); const onOptions = vi.fn(); const onSpan = vi.fn();
    render(<CardControls def={REGISTRY.hourly} instance={instance} breakpoint="desktop" dragHandleProps={{ "data-testid": "handle" }} onRemove={onRemove} onOptions={onOptions} onSpan={onSpan} />);
    expect(screen.getByTestId("handle")).toHaveAttribute("aria-label", "Drag Hourly Forecast");
    fireEvent.click(screen.getByRole("button", { name: "Options for Hourly Forecast" }));
    expect(onOptions).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Remove Hourly Forecast" }));
    expect(onRemove).toHaveBeenCalled();
    expect(screen.getByTestId("span-readout")).toHaveTextContent("8 × 1");
    fireEvent.click(screen.getByRole("button", { name: "Wider Hourly Forecast" }));
    expect(onSpan).toHaveBeenLastCalledWith({ cols: 9, rows: 1 });
    fireEvent.click(screen.getByRole("button", { name: "Taller Hourly Forecast" }));
    expect(onSpan).toHaveBeenLastCalledWith({ cols: 8, rows: 2 });
  });

  it("disables steppers at the card's minimum width and the grid's limits", () => {
    const atMin = { ...instance, span: { cols: REGISTRY.hourly.minCols, rows: 3 } };
    render(<CardControls def={REGISTRY.hourly} instance={atMin} breakpoint="desktop" dragHandleProps={{}} onRemove={() => {}} onOptions={() => {}} onSpan={() => {}} />);
    expect(screen.getByRole("button", { name: "Narrower Hourly Forecast" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Taller Hourly Forecast" })).toBeDisabled();
    const full = { ...instance, span: { cols: 12, rows: 1 } };
    render(<CardControls def={REGISTRY.hourly} instance={full} breakpoint="desktop" dragHandleProps={{}} onRemove={() => {}} onOptions={() => {}} onSpan={() => {}} />);
    expect(screen.getAllByRole("button", { name: "Wider Hourly Forecast" })[1]).toBeDisabled();
    expect(screen.getAllByRole("button", { name: "Shorter Hourly Forecast" })[1]).toBeDisabled();
  });

  it("has no size steppers on the phone and no options button for option-less cards", () => {
    const def = { ...REGISTRY.hourly, fields: [] };
    render(<CardControls def={def} instance={instance} breakpoint="phone" dragHandleProps={{}} onRemove={() => {}} onOptions={() => {}} onSpan={() => {}} />);
    expect(screen.queryByTestId("span-readout")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Options for/ })).not.toBeInTheDocument();
  });
});
