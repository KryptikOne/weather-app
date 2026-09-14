import type { Condition, ConditionGroup } from "./types";

export function groupForCode(code: number): ConditionGroup {
  if (code >= 200 && code < 300) return "thunder";
  if (code >= 300 && code < 400) return "drizzle";
  if (code >= 500 && code < 600) return "rain";
  if (code >= 600 && code < 700) return "snow";
  if (code >= 700 && code < 800) return "fog";
  if (code === 800) return "clear";
  if (code > 800 && code < 900) return "clouds";
  return "other";
}

export function toCondition(w: { id: number; description: string; icon: string }): Condition {
  const label = w.description.charAt(0).toUpperCase() + w.description.slice(1);
  return { code: w.id, group: groupForCode(w.id), label, isNight: w.icon.endsWith("n") };
}
