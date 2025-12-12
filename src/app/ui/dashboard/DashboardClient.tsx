'use client'
import React, { useState } from 'react'
import LocationSearch from '@/app/ui/dashboard/search'
import CurrentConditions from '@/app/ui/dashboard/current-conditions'
import HourlyConditions from '@/app/ui/dashboard/hourly-conditions'
import DailyConditions from '@/app/ui/dashboard/daily-conditions'
import MoonPhase from '@/app/ui/dashboard/moon-phase'
import SunriseSunset from '@/app/ui/dashboard/sunrise-sunset'

export default function DashboardClient({
  currentdata,
  locationLatLong = { lat: 41.881832, lon: -87.623177 }, // Default to Chicago if no location provided
}: {
  currentdata: unknown,
  locationLatLong?: { lat: number; lon: number }
}) {
  const currentWeather = currentdata
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)

  const handleLocationSelected = (lat: number, lon: number) => {
    setCoords({ lat, lon })
    // Optionally trigger data fetches for widgets here
  };

  return (
    <>
      <LocationSearch onLocationSelected={handleLocationSelected} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-gray-300">
        {coords && (
          <CurrentConditions data={currentWeather} coords={coords} />
        )}
        <HourlyConditions coords={coords} />
        <DailyConditions coords={coords} />
        <MoonPhase coords={coords} />
        <SunriseSunset coords={coords} />
      </div>
    </>
  )
}
