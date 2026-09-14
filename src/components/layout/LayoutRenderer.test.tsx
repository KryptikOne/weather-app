import { render, screen } from "@testing-library/react";
import { Sun } from "lucide-react";
import { describe, expect, it } from "vitest";
import { defineCard, type AnyCardDefinition, type CardProps } from "@/cards/types";
import { baseCardProps } from "@/test/fixtures";
import { LayoutRenderer, type LayoutData } from "./LayoutRenderer";

const Stub = ({ instance, status, breakpoint }: CardProps) => (
  <div>{instance.type}:{status}:{breakpoint}</div>
);

const registry: Record<string, AnyCardDefinition> = {
  a: defineCard({ type: "a", title: "A", icon: Sun, component: Stub, defaultOptions: {}, fields: [], breakpoints: ["phone", "desktop"], defaultSpan: { cols: 8, rows: 1 }, minCols: 2, needs: ["weather"] }),
  b: defineCard({ type: "b", title: "B", icon: Sun, component: Stub, defaultOptions: {}, fields: [], breakpoints: ["desktop"], defaultSpan: { cols: 4, rows: 2 }, minCols: 2, needs: ["astro"] }),
  h: defineCard({ type: "h", title: "H", icon: Sun, component: Stub, defaultOptions: {}, fields: [], breakpoints: ["phone", "desktop"], defaultSpan: { cols: 4, rows: 1 }, minCols: 2, needs: [], isHidden: () => true }),
};

const base = baseCardProps();
const data: LayoutData = { snapshot: base.snapshot, weatherStatus: "ready", astro: base.astro, location: base.location, units: base.units };
const cards = [
  { id: "1", type: "a", options: {} },
  { id: "2", type: "b", options: {} },
  { id: "3", type: "nope", options: {} },
  { id: "4", type: "h", options: {} },
];

describe("LayoutRenderer", () => {
  it("renders phone cards in order, skipping desktop-only, unknown, and hidden cards", () => {
    render(<LayoutRenderer cards={cards} breakpoint="phone" data={data} registry={registry} />);
    expect(screen.getByText("a:ready:phone")).toBeInTheDocument();
    expect(screen.queryByText(/^b:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^h:/)).not.toBeInTheDocument();
  });

  it("renders desktop cards with their default spans", () => {
    render(<LayoutRenderer cards={cards} breakpoint="desktop" data={data} registry={registry} />);
    expect(screen.getByTestId("cell-1")).toHaveStyle({ gridColumn: "span 8" });
    expect(screen.getByTestId("cell-2")).toHaveStyle({ gridRow: "span 2" });
    expect(screen.getByText("b:ready:desktop")).toBeInTheDocument();
  });

  it("uses an explicit span when the instance has one", () => {
    render(<LayoutRenderer cards={[{ id: "1", type: "a", options: {}, span: { cols: 12, rows: 1 } }]} breakpoint="desktop" data={data} registry={registry} />);
    expect(screen.getByTestId("cell-1")).toHaveStyle({ gridColumn: "span 12" });
  });

  it("wraps every rendered card when a wrapper is given", () => {
    render(
      <LayoutRenderer
        cards={cards}
        breakpoint="phone"
        data={data}
        registry={registry}
        wrap={({ instance }, node) => <div data-testid={`wrap-${instance.id}`}>{node}</div>}
      />,
    );
    expect(screen.getByTestId("wrap-1")).toHaveTextContent("a:ready:phone");
  });

  it("shows hidden cards while editing", () => {
    render(<LayoutRenderer cards={cards} breakpoint="phone" data={data} registry={registry} editing />);
    expect(screen.getByText("h:ready:phone")).toBeInTheDocument();
  });
});
