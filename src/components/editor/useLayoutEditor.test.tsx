import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { REGISTRY } from "@/cards/registry";
import type { Breakpoint } from "@/cards/types";
import { STORAGE_KEY } from "@/lib/store/persist";
import { StoreProvider, useAppState } from "@/lib/store/StoreProvider";
import { useLayoutEditor } from "./useLayoutEditor";

const wrapper = ({ children }: { children: React.ReactNode }) => <StoreProvider catalog={{ sun: { defaultOptions: {} }, current: { defaultOptions: {} } }}>{children}</StoreProvider>;
const seed = () => window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
  version: 1, units: {}, locations: { saved: [], active: "current" },
  layouts: { phone: [{ id: "a", type: "current", options: {} }, { id: "b", type: "sun", options: {} }], desktop: [] },
}));

function useBoth(breakpoint: Breakpoint) {
  return { editor: useLayoutEditor(breakpoint), store: useAppState() };
}

describe("useLayoutEditor", () => {
  beforeEach(() => { window.localStorage.clear(); seed(); });

  it("starts from the stored layout, edits a draft, and commits on done", async () => {
    const { result } = renderHook(() => useBoth("phone"), { wrapper });
    await waitFor(() => expect(result.current.store.hydrated).toBe(true));
    expect(result.current.editor.editing).toBe(false);
    act(() => result.current.editor.start());
    expect(result.current.editor.draft?.map((c) => c.id)).toEqual(["a", "b"]);
    act(() => result.current.editor.remove("a"));
    expect(result.current.editor.draft?.map((c) => c.id)).toEqual(["b"]);
    expect(result.current.store.state.layouts.phone).toHaveLength(2);   // store untouched until done
    act(() => result.current.editor.done());
    expect(result.current.editor.editing).toBe(false);
    expect(result.current.store.state.layouts.phone.map((c) => c.id)).toEqual(["b"]);
  });

  it("discards on cancel and restores defaults on reset", async () => {
    const { result } = renderHook(() => useBoth("phone"), { wrapper });
    await waitFor(() => expect(result.current.store.hydrated).toBe(true));
    act(() => result.current.editor.start());
    act(() => result.current.editor.add(REGISTRY.sun));
    expect(result.current.editor.draft).toHaveLength(3);
    act(() => result.current.editor.cancel());
    expect(result.current.store.state.layouts.phone).toHaveLength(2);
    act(() => result.current.editor.start());
    act(() => result.current.editor.reset());
    expect(result.current.editor.draft).toHaveLength(9);   // the full phone default list, sanitized through the real CATALOG
  });

  it("abandons the draft when the breakpoint changes", async () => {
    const { result, rerender } = renderHook(({ bp }) => useBoth(bp), { wrapper, initialProps: { bp: "phone" as Breakpoint } });
    await waitFor(() => expect(result.current.store.hydrated).toBe(true));
    act(() => result.current.editor.start());
    expect(result.current.editor.editing).toBe(true);
    rerender({ bp: "desktop" });
    expect(result.current.editor.editing).toBe(false);
  });

  it("updates span and options on one card", async () => {
    const { result } = renderHook(() => useBoth("phone"), { wrapper });
    await waitFor(() => expect(result.current.store.hydrated).toBe(true));
    act(() => result.current.editor.start());
    act(() => result.current.editor.setOptions("b", { showTwilight: false }));
    act(() => result.current.editor.setSpan("b", { cols: 6, rows: 1 }));
    const b = result.current.editor.draft?.find((c) => c.id === "b");
    expect(b?.options).toEqual({ showTwilight: false });
    expect(b?.span).toEqual({ cols: 6, rows: 1 });
  });
});
