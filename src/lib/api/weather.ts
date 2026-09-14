import { parseCoords } from "@/lib/geo";
import type { WeatherProvider } from "@/lib/weather/provider";

export async function handleWeather(params: URLSearchParams, provider: WeatherProvider): Promise<Response> {
  const coords = parseCoords(params);
  if (!coords) return Response.json({ error: "bad coordinates" }, { status: 400 });
  try {
    const snapshot = await provider.fetchSnapshot(coords.lat, coords.lon);
    return Response.json(snapshot, { headers: { "Cache-Control": "private, max-age=60" } });
  } catch (err) {
    console.error("weather upstream failure", err instanceof Error ? err.message.replace(/appid=\S+/g, "appid=***") : err);
    return Response.json({ error: "upstream" }, { status: 502 });
  }
}
