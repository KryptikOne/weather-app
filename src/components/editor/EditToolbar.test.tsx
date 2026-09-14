import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditToolbar } from "./EditToolbar";

describe("EditToolbar", () => {
  it("names the breakpoint and wires all four actions", () => {
    const h = { onAdd: vi.fn(), onReset: vi.fn(), onCancel: vi.fn(), onDone: vi.fn() };
    render(<EditToolbar breakpoint="desktop" {...h} />);
    expect(screen.getByText(/editing desktop layout/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add card" })); expect(h.onAdd).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Reset" })); expect(h.onReset).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Cancel" })); expect(h.onCancel).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Done" })); expect(h.onDone).toHaveBeenCalled();
  });
});
