import React from 'react';
import Header from '@/app/ui/global/header';
import Banner from '@/app/ui/global/banner';
import CurrentConditionsWidget from '@/app/dashboard/widgets/CurrentConditionsWidget';
import HourlyConditionsWidget from '@/app/dashboard/widgets/HourlyConditionsWidget';
import DailyConditionsWidget from '@/app/dashboard/widgets/DailyConditionsWidget';
import MoonPhaseWidget from '@/app/dashboard/widgets/MoonPhaseWidget';
import SunriseSunsetWidget from '@/app/dashboard/widgets/SunriseSunsetWidget';

export default function DashboardPage() {
  return (
    <div className="page dashboard min-h-full">
      <Header />
      <Banner />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        <CurrentConditionsWidget />
        <HourlyConditionsWidget />
        <DailyConditionsWidget />
        <MoonPhaseWidget />
        <SunriseSunsetWidget />
      </div>
    </div>
  );
}
