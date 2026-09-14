import type { Units } from "./units";

type D = Date | string;
const toDate = (d: D) => (typeof d === "string" ? new Date(d) : d);

export function formatTime(d: D, timeZone: string, units: Units): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", hour12: units.time === "12h", timeZone,
  }).format(toDate(d)).replace(/^24:/, "00:");
}

export function formatHourLabel(d: D, timeZone: string, units: Units): string {
  if (units.time === "24h") {
    return new Intl.DateTimeFormat("en-US", { hour: "2-digit", hour12: false, timeZone }).format(toDate(d)).replace(/^24$/, "00");
  }
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: true, timeZone })
    .format(toDate(d)).replace(" ", "");
}

export const formatWeekday = (d: D, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone }).format(toDate(d));

export const formatShortDate = (d: D, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone }).format(toDate(d));

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h} ${h === 1 ? "hr" : "hrs"} ${m} ${m === 1 ? "min" : "mins"}`;
}
