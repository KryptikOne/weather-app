import React from 'react'
import Header from '@/app/ui/global/header'
import DashboardClient from '@/app/ui/dashboard/DashboardClient'
import { fetchCurrentWeather } from '../lib/utils'
import { fetchLatLongByCity } from '../lib/utils'

export default async function DashboardPage() {
  const currentWeatherData = await fetchCurrentWeather()
  const locationFetch = await fetchLatLongByCity()

  return (
    <div className="page dashboard min-h-full">
      <Header />
      <DashboardClient currentdata={currentWeatherData} locationLatLong={locationFetch} />
    </div>
  )
}
