"use client";
import { useSyncExternalStore } from "react";
import type { Breakpoint } from "@/cards/types";

const QUERY = "(min-width: 64rem)";

function subscribe(cb: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(QUERY).matches ? "desktop" : "phone"),
    () => "phone",
  );
}
