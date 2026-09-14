"use client";
import useSWR from "swr";
import type { CardStatus } from "@/cards/types";
import { roundCoord, type Coords } from "@/lib/geo";
import type { WeatherSnapshot } from "@/lib/weather/types";

const TEN_MINUTES = 10 * 60 * 1000;

async function fetchSnapshot(url: string): Promise<WeatherSnapshot> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`weather ${res.status}`);
  return res.json();
}

export function useWeather(coords: Coords | null): { snapshot?: WeatherSnapshot; status: CardStatus; refetch: () => void } {
  const key = coords ? `/api/weather?lat=${roundCoord(coords.lat)}&lon=${roundCoord(coords.lon)}` : null;
  const { data, error, isLoading, mutate } = useSWR(key, fetchSnapshot, {
    refreshInterval: TEN_MINUTES,
    revalidateOnFocus: true,
    keepPreviousData: true,
    dedupingInterval: 60 * 1000,
  });
  let status: CardStatus = "loading";
  if (data && error) status = "stale";
  else if (data) status = "ready";
  else if (error) status = "error";
  else if (!key || isLoading) status = "loading";
  return { snapshot: data, status, refetch: () => void mutate() };
}
