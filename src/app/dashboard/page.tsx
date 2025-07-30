import React from 'react'
import Header from '@/app/ui/global/header'
import DashboardClient from '@/app/ui/dashboard/DashboardClient'
import { fetchCurrentWeather } from '../lib/utils'

export default async function DashboardPage() {
  const currentWeatherData = await fetchCurrentWeather()

  return (
    <div className="page dashboard min-h-full">
      <Header />
      <DashboardClient currentdata={currentWeatherData} />
    </div>
  )
}
