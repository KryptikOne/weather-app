import type { CardStatus, DataNeed } from "@/cards/types";

export function statusFor(needs: DataNeed[], d: { weatherStatus: CardStatus; hasAstro: boolean }): CardStatus {
  const needsAstro = needs.includes("astro");
  const needsWeather = needs.includes("weather") || needs.includes("air");
  if (needsAstro && !d.hasAstro) return "loading";
  if (needsWeather) return d.weatherStatus;
  return "ready";
}
