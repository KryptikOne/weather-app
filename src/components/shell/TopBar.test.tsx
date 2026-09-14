import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("shows the location and wires the buttons", () => {
    const onOpenSwitcher = vi.fn();
    const onUseCurrent = vi.fn();
    render(<TopBar locationName="Downers Grove" status="ready" onOpenSwitcher={onOpenSwitcher} onUseCurrent={onUseCurrent} onRefresh={() => {}} onEdit={() => {}} onSettings={() => {}} />);
    screen.getByRole("button", { name: /Downers Grove/ }).click();
    expect(onOpenSwitcher).toHaveBeenCalled();
    screen.getByRole("button", { name: /use current location/i }).click();
    expect(onUseCurrent).toHaveBeenCalled();
  });

  it("shows a resolving label without a location", () => {
    render(<TopBar locationName={null} status="resolving" onOpenSwitcher={() => {}} onUseCurrent={() => {}} onRefresh={() => {}} onEdit={() => {}} onSettings={() => {}} />);
    expect(screen.getByRole("button", { name: /finding you/i })).toBeInTheDocument();
  });
});
