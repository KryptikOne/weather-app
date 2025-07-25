import React from 'react';
// D3.js chart placeholder for hourly conditions
export default function HourlyConditionsWidget() {
  return (
    <div className="widget bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Hourly Conditions</h2>
      <div className="h-40 flex items-center justify-center text-gray-400">
        {/* D3.js chart will go here */}
        <span>Hourly Conditions Chart</span>
      </div>
    </div>
  );
}
