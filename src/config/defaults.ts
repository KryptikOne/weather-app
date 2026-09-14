import type { CardInstance } from "@/cards/types";
import { DEFAULT_UNITS } from "@/lib/format/units";
import type { AppState } from "@/lib/store/state";

const card = (id: string, type: string, span?: CardInstance["span"]): CardInstance =>
  ({ id, type, options: {}, ...(span ? { span } : {}) });

export const DEFAULT_PHONE_LAYOUT: CardInstance[] = [
  card("p-alerts", "alerts"),
  card("p-current", "current"),
  card("p-hourly", "hourly"),
  card("p-precip", "precip-next-hour"),
  card("p-daily", "daily"),
  card("p-sun", "sun"),
  card("p-moon", "moon"),
  card("p-details", "details"),
  card("p-air", "air-quality"),
];

export const DEFAULT_DESKTOP_LAYOUT: CardInstance[] = [
  card("d-hero", "hero", { cols: 12, rows: 1 }),
  card("d-alerts", "alerts", { cols: 12, rows: 1 }),
  card("d-hourly", "hourly", { cols: 8, rows: 1 }),
  card("d-daily", "daily", { cols: 4, rows: 2 }),
  card("d-sun", "sun", { cols: 4, rows: 1 }),
  card("d-moon", "moon", { cols: 4, rows: 1 }),
  card("d-precip", "precip-next-hour", { cols: 4, rows: 1 }),
  card("d-details", "details", { cols: 8, rows: 1 }),
  card("d-air", "air-quality", { cols: 4, rows: 1 }),
];

export const DEFAULT_STATE: AppState = {
  version: 1,
  layouts: { phone: DEFAULT_PHONE_LAYOUT, desktop: DEFAULT_DESKTOP_LAYOUT },
  units: DEFAULT_UNITS,
  locations: { saved: [], active: "current" },
};
