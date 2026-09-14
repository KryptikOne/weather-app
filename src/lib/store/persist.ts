import type { CardInstance } from "@/cards/types";
import type { AppState } from "./state";

export const STORAGE_KEY = "weather-app:state:v1";
export type Catalog = Record<string, { defaultOptions: Record<string, unknown> }>;

export function sanitizeLayout(cards: unknown, catalog: Catalog): CardInstance[] {
  if (!Array.isArray(cards)) return [];
  const out: CardInstance[] = [];
  for (const c of cards) {
    if (!c || typeof c !== "object") continue;
    const { id, type, options, span } = c as Partial<CardInstance>;
    if (typeof id !== "string" || typeof type !== "string" || !(type in catalog)) continue;
    const given = options && typeof options === "object" ? options : {};
    out.push({ id, type, options: { ...catalog[type].defaultOptions, ...given }, ...(span ? { span } : {}) });
  }
  return out;
}

export function loadState(raw: string | null, defaults: AppState, catalog: Catalog): AppState {
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (parsed.version !== defaults.version) return defaults;
    const loc = parsed.locations;
    return {
      version: defaults.version,
      layouts: {
        phone: sanitizeLayout(parsed.layouts?.phone, catalog),
        desktop: sanitizeLayout(parsed.layouts?.desktop, catalog),
      },
      units: { ...defaults.units, ...(parsed.units ?? {}) },
      locations: {
        saved: Array.isArray(loc?.saved) ? loc.saved : [],
        active: typeof loc?.active === "string" ? loc.active : "current",
        ...(loc?.lastKnown ? { lastKnown: loc.lastKnown } : {}),
      },
    };
  } catch {
    return defaults;
  }
}

export function readStorage(): string | null {
  try { return window.localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

export function writeStorage(state: AppState): void {
  try {
    const json = JSON.stringify(state);
    if (window.localStorage.getItem(STORAGE_KEY) === json) return;
    window.localStorage.setItem(STORAGE_KEY, json);
  } catch {
    // storage unavailable (private mode, quota); state stays in memory
  }
}
