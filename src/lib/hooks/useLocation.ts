"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CardLocation } from "@/cards/types";
import { haversineKm } from "@/lib/geo";
import { useAppState } from "@/lib/store/StoreProvider";
import { resolveLocation } from "./resolveLocation";

export type LocationStatus = "resolving" | "ready" | "denied";

async function reverseName(lat: number, lon: number): Promise<string | undefined> {
  try {
    const res = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
    if (!res.ok) return undefined;
    const rows = (await res.json()) as { name: string; region?: string }[];
    return rows[0] ? rows[0].name : undefined;
  } catch {
    return undefined;
  }
}

const geolocationSupported = () => typeof navigator !== "undefined" && Boolean(navigator.geolocation);

export function useLocation(): { location: CardLocation | null; status: LocationStatus; requestCurrent: () => void } {
  const { state, dispatch, hydrated } = useAppState();
  const [denied, setDenied] = useState(false);
  const asked = useRef(false);
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const resolved = resolveLocation(state.locations, browserTz);
  const lastKnown = state.locations.lastKnown;

  const requestCurrent = useCallback(() => {
    if (!geolocationSupported()) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude, lon = pos.coords.longitude;
        const moved = !lastKnown || haversineKm(lastKnown, { lat, lon }) > 1;
        if (!moved) return;
        const name = await reverseName(lat, lon);
        dispatch({ type: "setLastKnown", lastKnown: { lat, lon, name, at: new Date().toISOString() } });
        setDenied(false);
      },
      () => {
        setDenied(true);
        const first = state.locations.saved[0];
        if (!lastKnown && first) dispatch({ type: "setActiveLocation", active: first.id });
      },
      { maximumAge: 5 * 60 * 1000, timeout: 15000 },
    );
  }, [dispatch, lastKnown, state.locations.saved]);

  useEffect(() => {
    if (!hydrated || asked.current) return;
    if (state.locations.active !== "current") return;
    asked.current = true;
    requestCurrent();
  }, [hydrated, state.locations.active, requestCurrent]);

  if (!hydrated) return { location: null, status: "resolving", requestCurrent };
  if (resolved.location) return { location: resolved.location, status: "ready", requestCurrent };
  const blocked = denied || !geolocationSupported();
  return { location: null, status: blocked ? "denied" : "resolving", requestCurrent };
}
