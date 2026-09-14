import type { WeatherSnapshot } from "./types";

export interface WeatherProvider {
  id: string;
  fetchSnapshot(lat: number, lon: number): Promise<WeatherSnapshot>;
}
