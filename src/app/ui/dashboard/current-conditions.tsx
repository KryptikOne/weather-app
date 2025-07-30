import React from 'react';

// export type Location = { lat: number; lon: number } | null;

export default function CurrentConditions({
  location,
  data
}: {
  location: Location,
  data: unknown
}) {
  const currentData = data || {}
  console.log('Current Conditions Data:', currentData)
  console.log('Current Location:', location)

  return (
    <div className="widget bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Current Conditions</h2>
      <div className="h-40 flex items-center justify-center text-gray-400">
        <span>Current Conditions Chart</span>
        <div className="current-temp">
          <span className="text-2xl font-bold">
            {/* {currentData.main ? `${Math.round(currentData.main.temp)}°F` : 'N/A'} */}
          </span>
        </div>
      </div>
    </div>
  );
}
