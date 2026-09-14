import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEY } from "@/lib/store/persist";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { UnitsForm } from "./UnitsForm";

describe("UnitsForm", () => {
  beforeEach(() => window.localStorage.clear());

  it("shows the current units and persists a change", async () => {
    render(<StoreProvider catalog={{}}><UnitsForm /></StoreProvider>);
    const f = await screen.findByRole("radio", { name: "°F" });
    await waitFor(() => expect(f).toHaveAttribute("aria-checked", "true"));
    fireEvent.click(screen.getByRole("radio", { name: "°C" }));
    await waitFor(() => expect(screen.getByRole("radio", { name: "°C" })).toHaveAttribute("aria-checked", "true"));
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}").units.temp).toBe("C");
    expect(screen.getByRole("radiogroup", { name: "Time" })).toBeInTheDocument();
  });
});
