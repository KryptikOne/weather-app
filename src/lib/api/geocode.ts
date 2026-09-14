import { parseCoords } from "@/lib/geo";

export type GeocodeResult = { name: string; region?: string; country: string; lat: number; lon: number };

type OwmGeo = { name: string; state?: string; country: string; lat: number; lon: number };
const GEO = "https://api.openweathermap.org/geo/1.0";

export async function handleGeocode(params: URLSearchParams, apiKey: string, fetchImpl: typeof fetch = fetch): Promise<Response> {
  const q = params.get("q")?.trim();
  const coords = parseCoords(params);
  let url: string;
  if (q) url = `${GEO}/direct?q=${encodeURIComponent(q)}&limit=5&appid=${apiKey}`;
  else if (coords) url = `${GEO}/reverse?lat=${coords.lat}&lon=${coords.lon}&limit=1&appid=${apiKey}`;
  else return Response.json({ error: "q or lat/lon required" }, { status: 400 });

  try {
    const res = await fetchImpl(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`geocode ${res.status}`);
    const rows = (await res.json()) as OwmGeo[];
    const out: GeocodeResult[] = rows.map((r) => ({ name: r.name, region: r.state, country: r.country, lat: r.lat, lon: r.lon }));
    return Response.json(out);
  } catch (err) {
    console.error("geocode upstream failure", err instanceof Error ? err.message : err);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
