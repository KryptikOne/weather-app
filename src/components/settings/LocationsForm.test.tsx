import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEY } from "@/lib/store/persist";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { LocationsForm } from "./LocationsForm";

const tokyo = { id: "x", name: "Tokyo", country: "JP", lat: 35.6, lon: 139.7 };
const denver = { id: "d", name: "Denver", country: "US", lat: 39.7, lon: -104.9 };
const stored = () => JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");

describe("LocationsForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, layouts: {}, units: {}, locations: { saved: [tokyo, denver], active: "x" } }));
  });

  it("reorders, activates, and removes saved locations", async () => {
    render(<StoreProvider catalog={{}}><LocationsForm /></StoreProvider>);
    await screen.findByText("Tokyo");
    fireEvent.click(screen.getByRole("button", { name: "Move Denver up" }));
    expect(stored().locations.saved.map((l: { id: string }) => l.id)).toEqual(["d", "x"]);
    fireEvent.click(screen.getByRole("button", { name: "Use Denver" }));
    expect(stored().locations.active).toBe("d");
    fireEvent.click(screen.getByRole("button", { name: "Use current location" }));
    expect(stored().locations.active).toBe("current");
    fireEvent.click(screen.getByRole("button", { name: "Remove Tokyo" }));
    expect(stored().locations.saved).toHaveLength(1);
    expect(screen.getByText(/add cities from the location switcher/i)).toBeInTheDocument();
  });
});
