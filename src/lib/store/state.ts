import type { Breakpoint, CardInstance } from "@/cards/types";
import type { Units } from "@/lib/format/units";

export type SavedLocation = { id: string; name: string; region?: string; country: string; lat: number; lon: number };
export type LastKnown = { lat: number; lon: number; name?: string; at: string };

export type AppState = {
  version: 1;
  layouts: Record<Breakpoint, CardInstance[]>;
  units: Units;
  locations: {
    saved: SavedLocation[];
    active: "current" | string;
    lastKnown?: LastKnown;
  };
};
