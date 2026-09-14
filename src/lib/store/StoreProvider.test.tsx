import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { STORAGE_KEY } from "./persist";
import { StoreProvider, useAppState } from "./StoreProvider";

function Probe() {
  const { state, dispatch, hydrated } = useAppState();
  return (
    <div>
      <span data-testid="hydrated">{String(hydrated)}</span>
      <span data-testid="temp">{state.units.temp}</span>
      <button onClick={() => dispatch({ type: "setUnits", units: { temp: "C" } })}>c</button>
    </div>
  );
}

const catalog = { sun: { defaultOptions: {} } };

describe("StoreProvider", () => {
  beforeEach(() => window.localStorage.clear());

  it("hydrates from storage and writes changes back", async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, units: { temp: "C" }, layouts: {}, locations: { saved: [], active: "current" } }));
    render(<StoreProvider catalog={catalog}><Probe /></StoreProvider>);
    expect(await screen.findByText("true")).toBeInTheDocument();
    expect(screen.getByTestId("temp")).toHaveTextContent("C");
  });

  it("persists a dispatched change", async () => {
    render(<StoreProvider catalog={catalog}><Probe /></StoreProvider>);
    await screen.findByText("true");
    act(() => screen.getByText("c").click());
    expect(screen.getByTestId("temp")).toHaveTextContent("C");
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}").units.temp).toBe("C");
  });
});
