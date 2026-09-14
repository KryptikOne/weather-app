import type { AirQuality } from "@/lib/weather/types";

const BANDS: Record<AirQuality["aqi"], { label: string; color: string }> = {
  1: { label: "Good", color: "#22c55e" },
  2: { label: "Fair", color: "#a3e635" },
  3: { label: "Moderate", color: "#facc15" },
  4: { label: "Poor", color: "#f97316" },
  5: { label: "Very Poor", color: "#ef4444" },
};

export const aqiBand = (aqi: AirQuality["aqi"]) => BANDS[aqi];

export const COMPONENT_LABELS: Record<keyof AirQuality["components"], string> = {
  pm2_5: "PM2.5", pm10: "PM10", o3: "O₃", no2: "NO₂", so2: "SO₂", co: "CO", nh3: "NH₃", no: "NO",
};
