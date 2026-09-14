import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { baseCardProps } from "@/test/fixtures";
import type { LayoutData } from "@/components/layout/LayoutRenderer";
import { EditableLayout } from "./EditableLayout";

const base = baseCardProps();
const data: LayoutData = { snapshot: base.snapshot, weatherStatus: "ready", astro: base.astro, location: base.location, units: base.units };
const draft = [
  { id: "al", type: "alerts", options: { alwaysShow: false } },
  { id: "su", type: "sun", options: {} },
];

describe("EditableLayout", () => {
  it("renders controls for every draft card, including ones that would auto-hide", () => {
    const onRemove = vi.fn(); const onOptions = vi.fn();
    render(<EditableLayout draft={draft} breakpoint="phone" data={data} onMove={() => {}} onRemove={onRemove} onOptions={onOptions} onSpan={() => {}} />);
    expect(screen.getByTestId("sortable-al")).toBeInTheDocument();
    expect(screen.getByTestId("sortable-su")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove Alerts" }));
    expect(onRemove).toHaveBeenCalledWith("al");
    fireEvent.click(screen.getByRole("button", { name: "Options for Sun" }));
    expect(onOptions).toHaveBeenCalledWith("su");
  });

  it("shows the size steppers on desktop and reports span changes with the card id", () => {
    const onSpan = vi.fn();
    render(<EditableLayout draft={draft} breakpoint="desktop" data={data} onMove={() => {}} onRemove={() => {}} onOptions={() => {}} onSpan={onSpan} />);
    fireEvent.click(screen.getByRole("button", { name: "Narrower Alerts" }));
    expect(onSpan).toHaveBeenCalledWith("al", { cols: 11, rows: 1 });
  });
});
