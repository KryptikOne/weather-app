'use server'

const ONE_CALL_URL = 'https://api.openweathermap.org/data/3.0/onecall'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

export async function fetchCurrentWeather(lat: number = 41.881832, lon: number = -87.623177) {
  try {
    // Artificially delay a response for demo purposes
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    const res = await fetch(`${ONE_CALL_URL}?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`)
    const data = await res.json()
    console.log('Current data fetch completed: ', data)
    return data
  } catch (error) {
    console.error('Current Weather Fetch Error:', error)
    throw new Error('Failed to fetch current weather data.')
  }
}

export async function fetchLatLongByCity(city: string, countryCode?: string) {
  try {
    const q = countryCode ? `${city},${countryCode}` : city
    const res = await fetch(`${GEO_URL}?q=${encodeURIComponent(q)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`)
    if (!res.ok) throw new Error('Failed to fetch location')
    const data = await res.json()
    if (!data || data.length === 0) throw new Error('No location found')
    const { lat, lon } = data[0]
    return { lat, lon };
  } catch (error) {
    console.error('Location Search Error:', error)
    throw new Error('Failed to fetch location data.')
  }
}

// Need to add more for hourly, daily, moon phase, sunrise/sunset etc.
