import type { CardProps } from "@/cards/types";
import { getAstro } from "@/lib/astro";
import { DEFAULT_UNITS } from "@/lib/format/units";
import air from "@/lib/weather/fixtures/air.json";
import onecall from "@/lib/weather/fixtures/onecall.json";
import { mapOneCall, type AirResponse, type OneCallResponse } from "@/lib/weather/openweather";
import type { WeatherSnapshot } from "@/lib/weather/types";

export const FIXTURE_NOW = new Date("2026-09-13T17:00:00Z");

export function snapshotFixture(): WeatherSnapshot {
  return mapOneCall(onecall as unknown as OneCallResponse, air as unknown as AirResponse, FIXTURE_NOW);
}

export function baseCardProps(overrides: Partial<CardProps> = {}): CardProps {
  const snapshot = snapshotFixture();
  return {
    instance: { id: "t", type: "test", options: {} },
    options: {},
    snapshot,
    astro: getAstro(FIXTURE_NOW, snapshot.location.lat, snapshot.location.lon),
    location: { name: "Downers Grove", lat: snapshot.location.lat, lon: snapshot.location.lon, timezone: snapshot.location.timezone },
    units: DEFAULT_UNITS,
    status: "ready",
    breakpoint: "phone",
    ...overrides,
  };
}
