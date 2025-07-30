import React from 'react';

export type Location = { lat: number; lon: number } | null;

export default function MoonPhase({ location }: { location: Location }) {
  return (
    <div className="widget bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Moon Phase</h2>
      <div className="h-40 flex items-center justify-center text-gray-400">
        {/* Use location for data fetching */}
        <span>Moon Phase Visual</span>
      </div>
    </div>
  );
}
