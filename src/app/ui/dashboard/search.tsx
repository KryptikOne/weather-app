'use client'
import React, { useState } from 'react'
import { fetchLatLonByCity } from '@/app/lib/utils'

export default function LocationSearch({ onLocationSelected }: { onLocationSelected: (lat: number, lon: number) => void }) {
  const [city, setCity] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { lat, lon } = await fetchLatLonByCity(city, countryCode);
      onLocationSelected(lat, lon)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Location not found')
      } else {
        setError('Location not found')
      }
    } finally {
      setLoading(false)
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-2 p-4 bg-white rounded shadow">
      <label className="font-medium">City</label>
      <input
        type="text"
        value={city}
        onChange={e => setCity(e.target.value)}
        className="border rounded px-2 py-1"
        placeholder="Enter city name"
        required
      />
      <label className="font-medium">Country Code (optional)</label>
      <input
        type="text"
        value={countryCode}
        onChange={e => setCountryCode(e.target.value)}
        className="border rounded px-2 py-1"
        placeholder="e.g. US, GB, IN"
      />
      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 mt-2" disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
}
