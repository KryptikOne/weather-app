import { toCondition } from "./condition";
import type { WeatherProvider } from "./provider";
import type {
  AirQuality, CurrentConditions, DailyPoint, HourlyPoint,
  MinutePrecip, WeatherAlert, WeatherSnapshot,
} from "./types";

const ONE_CALL = "https://api.openweathermap.org/data/3.0/onecall";
const AIR = "https://api.openweathermap.org/data/2.5/air_pollution";

type OwmWeather = { id: number; main: string; description: string; icon: string };
type OwmCurrent = {
  dt: number; sunrise: number; sunset: number; temp: number; feels_like: number;
  pressure: number; humidity: number; dew_point: number; uvi: number; clouds: number;
  visibility?: number; wind_speed: number; wind_deg: number; wind_gust?: number; weather: OwmWeather[];
};
type OwmHourly = {
  dt: number; temp: number; feels_like: number; pressure: number; humidity: number; uvi: number;
  clouds: number; wind_speed: number; wind_deg: number; wind_gust?: number; pop: number;
  rain?: { "1h": number }; snow?: { "1h": number }; weather: OwmWeather[];
};
type OwmDaily = {
  dt: number; sunrise: number; sunset: number; moon_phase: number; summary?: string;
  temp: { min: number; max: number }; humidity: number; wind_speed: number; wind_deg: number;
  weather: OwmWeather[]; pop: number; rain?: number; snow?: number; uvi: number;
};
type OwmMinutely = { dt: number; precipitation: number };
type OwmAlert = { sender_name: string; event: string; start: number; end: number; description: string; tags?: string[] };

export type OneCallResponse = {
  lat: number; lon: number; timezone: string; current: OwmCurrent;
  minutely?: OwmMinutely[]; hourly: OwmHourly[]; daily: OwmDaily[]; alerts?: OwmAlert[];
};
export type AirResponse = {
  list: { main: { aqi: 1 | 2 | 3 | 4 | 5 }; components: AirQuality["components"] }[];
};

const iso = (unix: number) => new Date(unix * 1000).toISOString();

export function mapOneCall(oc: OneCallResponse, air: AirResponse | null, fetchedAt = new Date()): WeatherSnapshot {
  const c = oc.current;
  const current: CurrentConditions = {
    time: iso(c.dt), temp: c.temp, feelsLike: c.feels_like, humidity: c.humidity,
    dewPoint: c.dew_point, pressure: c.pressure, uvi: c.uvi, clouds: c.clouds,
    visibility: c.visibility ?? 10000, windSpeed: c.wind_speed, windGust: c.wind_gust ?? null,
    windDeg: c.wind_deg, condition: toCondition(c.weather[0]),
  };
  const hourly: HourlyPoint[] = oc.hourly.slice(0, 48).map((h) => ({
    time: iso(h.dt), temp: h.temp, feelsLike: h.feels_like, precipChance: h.pop,
    precipAmount: (h.rain?.["1h"] ?? 0) + (h.snow?.["1h"] ?? 0), humidity: h.humidity,
    uvi: h.uvi, windSpeed: h.wind_speed, windGust: h.wind_gust ?? null, windDeg: h.wind_deg,
    clouds: h.clouds, condition: toCondition(h.weather[0]),
  }));
  const daily: DailyPoint[] = oc.daily.slice(0, 8).map((d) => ({
    date: iso(d.dt), tempMin: d.temp.min, tempMax: d.temp.max, precipChance: d.pop,
    precipAmount: (d.rain ?? 0) + (d.snow ?? 0), uvi: d.uvi, humidity: d.humidity,
    windSpeed: d.wind_speed, windDeg: d.wind_deg, condition: toCondition(d.weather[0]),
    sunrise: iso(d.sunrise), sunset: iso(d.sunset), moonPhase: d.moon_phase, summary: d.summary ?? "",
  }));
  const minutely: MinutePrecip[] = (oc.minutely ?? []).slice(0, 60)
    .map((m) => ({ time: iso(m.dt), amount: m.precipitation }));
  const alerts: WeatherAlert[] = (oc.alerts ?? []).map((a) => ({
    sender: a.sender_name, event: a.event, start: iso(a.start), end: iso(a.end),
    description: a.description, tags: a.tags ?? [],
  }));
  const first = air?.list?.[0];
  const airQuality: AirQuality | null = first ? { aqi: first.main.aqi, components: first.components } : null;
  return {
    fetchedAt: fetchedAt.toISOString(),
    location: { lat: oc.lat, lon: oc.lon, timezone: oc.timezone },
    current, minutely, hourly, daily, alerts, air: airQuality,
  };
}

export function createOpenWeatherProvider(apiKey: string, fetchImpl: typeof fetch = fetch): WeatherProvider {
  return {
    id: "openweather",
    async fetchSnapshot(lat, lon) {
      const q = `lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const [ocRes, airRes] = await Promise.all([
        fetchImpl(`${ONE_CALL}?${q}&units=metric`, { next: { revalidate: 600 } }),
        fetchImpl(`${AIR}?${q}`, { next: { revalidate: 600 } }),
      ]);
      if (!ocRes.ok) throw new Error(`onecall ${ocRes.status}`);
      const oc = (await ocRes.json()) as OneCallResponse;
      const air = airRes.ok ? ((await airRes.json()) as AirResponse) : null;
      return mapOneCall(oc, air);
    },
  };
}
