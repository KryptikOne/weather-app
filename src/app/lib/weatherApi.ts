const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  throw new Error('OPENWEATHER_API_KEY is not set in environment variables');
}

export async function getHourlyForecast(lat: number, lon: number) {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch hourly forecast');
  return res.json();
}

export async function getCurrentConditions(lat: number, lon: number) {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch current conditions');
  return res.json();
}

// Need to add more for daily, moon phase, sunrise/sunset as needed
