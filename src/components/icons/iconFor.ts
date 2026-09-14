export function iconFor(c: { code: number; isNight: boolean }): string {
  const dn = c.isNight ? "night" : "day";
  const id = c.code;
  if (id >= 200 && id < 300) return [210, 211, 212, 221].includes(id) ? `thunderstorms-${dn}` : `thunderstorms-${dn}-rain`;
  if (id >= 300 && id < 400) return "drizzle";
  if (id === 511) return "sleet";
  if (id === 500) return `partly-cloudy-${dn}-rain`;
  if (id >= 500 && id < 600) return "rain";
  if (id >= 611 && id <= 616) return "sleet";
  if (id >= 600 && id < 700) return "snow";
  if (id === 701) return "mist";
  if (id === 711 || id === 762) return "smoke";
  if (id === 721) return "haze";
  if (id === 731 || id === 751 || id === 761) return "dust";
  if (id === 741) return `fog-${dn}`;
  if (id === 771) return "wind";
  if (id === 781) return "tornado";
  if (id === 800) return `clear-${dn}`;
  if (id === 801 || id === 802) return `partly-cloudy-${dn}`;
  if (id === 803) return `overcast-${dn}`;
  if (id === 804) return "overcast";
  return "not-available";
}
