import type { NextRequest } from "next/server";
import { handleGeocode } from "@/lib/api/geocode";

const key = process.env.OPENWEATHER_API_KEY;
if (!key) throw new Error("OPENWEATHER_API_KEY is not set");
const apiKey: string = key;

export async function GET(req: NextRequest) {
  return handleGeocode(req.nextUrl.searchParams, apiKey);
}
