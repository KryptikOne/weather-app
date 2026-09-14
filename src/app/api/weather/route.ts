import type { NextRequest } from "next/server";
import { handleWeather } from "@/lib/api/weather";
import { createOpenWeatherProvider } from "@/lib/weather/openweather";

const key = process.env.OPENWEATHER_API_KEY;
if (!key) throw new Error("OPENWEATHER_API_KEY is not set");
const provider = createOpenWeatherProvider(key);

export async function GET(req: NextRequest) {
  return handleWeather(req.nextUrl.searchParams, provider);
}
