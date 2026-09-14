"use client";
import { useEffect } from "react";
import type { WeatherPalette } from "./palette";

export function useWeatherTheme(p: WeatherPalette | null) {
  useEffect(() => {
    if (!p) return;
    const s = document.documentElement.style;
    s.setProperty("--sky-top", p.skyTop);
    s.setProperty("--sky-bottom", p.skyBottom);
    s.setProperty("--weather-accent", p.accent);
    s.setProperty("--weather-accent-foreground", p.accentForeground);
  }, [p]);
}
