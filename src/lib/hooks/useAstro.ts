"use client";
import { useEffect, useMemo, useState } from "react";
import { getAstro, type AstroData } from "@/lib/astro";
import type { Coords } from "@/lib/geo";

/** Ticks once a minute so the sun marker and phase labels stay current. */
export function useMinute(): number {
  const [minute, setMinute] = useState(() => Math.floor(Date.now() / 60000));
  useEffect(() => {
    const id = setInterval(() => setMinute(Math.floor(Date.now() / 60000)), 15000);
    return () => clearInterval(id);
  }, []);
  return minute;
}

export function useAstro(coords: Coords | null): AstroData | undefined {
  const minute = useMinute();
  return useMemo(
    () => (coords ? getAstro(new Date(minute * 60000), coords.lat, coords.lon) : undefined),
    [coords, minute],
  );
}
