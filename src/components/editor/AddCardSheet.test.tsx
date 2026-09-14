import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { REGISTRY } from "@/cards/registry";
import { AddCardSheet } from "./AddCardSheet";

describe("AddCardSheet", () => {
  it("lists only cards valid for the breakpoint and reports the chosen one", () => {
    const onAdd = vi.fn();
    const onOpenChange = vi.fn();
    render(<AddCardSheet open onOpenChange={onOpenChange} breakpoint="phone" onAdd={onAdd} />);
    expect(screen.queryByRole("button", { name: /^Now$/ })).not.toBeInTheDocument();
    expect(screen.getAllByTestId("add-card")).toHaveLength(Object.keys(REGISTRY).length - 1);
    fireEvent.click(screen.getByRole("button", { name: "Moon" }));
    expect(onAdd).toHaveBeenCalledWith(REGISTRY.moon);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("includes the hero on desktop", () => {
    render(<AddCardSheet open onOpenChange={() => {}} breakpoint="desktop" onAdd={() => {}} />);
    expect(screen.getByRole("button", { name: "Now" })).toBeInTheDocument();
  });
});
