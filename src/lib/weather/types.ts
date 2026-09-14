export type ConditionGroup =
  | "clear" | "clouds" | "rain" | "drizzle" | "snow" | "thunder" | "fog" | "other";

export type Condition = {
  code: number;
  group: ConditionGroup;
  label: string;
  isNight: boolean;
};

export type CurrentConditions = {
  time: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  dewPoint: number;
  pressure: number;
  uvi: number;
  clouds: number;
  visibility: number;
  windSpeed: number;
  windGust: number | null;
  windDeg: number;
  condition: Condition;
};

export type HourlyPoint = {
  time: string;
  temp: number;
  feelsLike: number;
  precipChance: number;
  precipAmount: number;
  humidity: number;
  uvi: number;
  windSpeed: number;
  windGust: number | null;
  windDeg: number;
  clouds: number;
  condition: Condition;
};

export type DailyPoint = {
  date: string;
  tempMin: number;
  tempMax: number;
  precipChance: number;
  precipAmount: number;
  uvi: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  condition: Condition;
  sunrise: string;
  sunset: string;
  moonPhase: number;
  summary: string;
};

export type MinutePrecip = { time: string; amount: number };

export type WeatherAlert = {
  sender: string;
  event: string;
  start: string;
  end: string;
  description: string;
  tags: string[];
};

export type AirQuality = {
  aqi: 1 | 2 | 3 | 4 | 5;
  components: {
    pm2_5: number; pm10: number; o3: number; no2: number;
    so2: number; co: number; nh3: number; no: number;
  };
};

export type WeatherSnapshot = {
  fetchedAt: string;
  location: { lat: number; lon: number; timezone: string };
  current: CurrentConditions;
  minutely: MinutePrecip[];
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  alerts: WeatherAlert[];
  air: AirQuality | null;
};
