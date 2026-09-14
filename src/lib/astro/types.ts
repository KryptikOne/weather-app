export type MoonPhaseName =
  | "New Moon" | "Waxing Crescent" | "First Quarter" | "Waxing Gibbous"
  | "Full Moon" | "Waning Gibbous" | "Last Quarter" | "Waning Crescent";

export type PrincipalPhase = "First Quarter" | "Full Moon" | "Last Quarter" | "New Moon";

export type SunData = {
  sunrise: Date; sunset: Date; solarNoon: Date; dawn: Date; dusk: Date;
  /** Civil dawn to civil dusk, "first to last light". */
  daylightMinutes: number;
  /** Sunrise to sunset. */
  sunUpMinutes: number;
};

export type MoonData = {
  phase: number;
  illumination: number;
  phaseName: MoonPhaseName;
  rise: Date | null;
  set: Date | null;
  next: { name: PrincipalPhase; date: Date }[];
};

export type AstroData = { sun: SunData; moon: MoonData };
