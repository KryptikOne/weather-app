import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY } from "@/lib/store/persist";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { CATALOG } from "@/cards/registry";
import { App } from "./App";

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }),
    });
  });
  afterEach(() => vi.restoreAllMocks());

  it("renders cards for a saved active location", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      layouts: { phone: [{ id: "s", type: "sun", options: {} }], desktop: [] },
      units: {},
      locations: { saved: [{ id: "x", name: "Tokyo", country: "JP", lat: 35.6, lon: 139.7 }], active: "x" },
    }));
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 502 }));
    render(<StoreProvider catalog={CATALOG}><App /></StoreProvider>);
    expect(await screen.findByRole("button", { name: /Tokyo/ })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Sun" })).toBeInTheDocument();
  });

  it("shows the empty state when geolocation is denied and nothing is saved", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: { getCurrentPosition: (_ok: unknown, fail: (e: unknown) => void) => fail({ code: 1 }) },
    });
    render(<StoreProvider catalog={CATALOG}><App /></StoreProvider>);
    expect(await screen.findByText(/pick a city/i)).toBeInTheDocument();
  });
});
