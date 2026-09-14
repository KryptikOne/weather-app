import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY } from "@/lib/store/persist";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { LocationSwitcher } from "./LocationSwitcher";

const tokyo = { id: "x", name: "Tokyo", country: "JP", lat: 35.6, lon: 139.7 };
const wrap = (ui: React.ReactElement) => render(<StoreProvider catalog={{}}>{ui}</StoreProvider>);

describe("LocationSwitcher", () => {
  afterEach(() => { vi.restoreAllMocks(); window.localStorage.clear(); });

  it("lists current location and saved favorites", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, layouts: {}, units: {}, locations: { saved: [tokyo], active: "x" } }));
    wrap(<LocationSwitcher open onOpenChange={() => {}} />);
    expect(await screen.findByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("Current location")).toBeInTheDocument();
  });

  it("searches, adds the chosen result, and closes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([{ name: "Denver", region: "Colorado", country: "US", lat: 39.7, lon: -104.9 }])),
    );
    const onOpenChange = vi.fn();
    wrap(<LocationSwitcher open onOpenChange={onOpenChange} />);
    const input = await screen.findByPlaceholderText(/search city/i);
    fireEvent.change(input, { target: { value: "denver" } });
    fireEvent.submit(input.closest("form")!);
    fireEvent.click(await screen.findByRole("button", { name: /Denver, Colorado/ }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(stored.locations.saved[0].name).toBe("Denver");
    expect(stored.locations.active).toBe(stored.locations.saved[0].id);
  });
});
