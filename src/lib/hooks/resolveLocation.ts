import type { CardLocation } from "@/cards/types";
import type { AppState } from "@/lib/store/state";

export type Resolved =
  | { kind: "saved"; location: CardLocation }
  | { kind: "current"; location: CardLocation }
  | { kind: "needs-geolocation"; location: null };

export function resolveLocation(locations: AppState["locations"], timezone: string): Resolved {
  if (locations.active !== "current") {
    const saved = locations.saved.find((l) => l.id === locations.active);
    if (saved) return { kind: "saved", location: { name: saved.name, lat: saved.lat, lon: saved.lon, timezone } };
  }
  const lk = locations.lastKnown;
  if (lk) return { kind: "current", location: { name: lk.name ?? "Current location", lat: lk.lat, lon: lk.lon, timezone } };
  return { kind: "needs-geolocation", location: null };
}
