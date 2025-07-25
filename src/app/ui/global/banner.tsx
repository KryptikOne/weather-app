'use client'

import { usePathname } from 'next/navigation'

export default function Banner() {
  const pathname = usePathname()
  console.log(pathname)

  return (
    <div className="banner bg-grey-100text-slate-800">
      <div className="shadow-sm w-full">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight">{ pathname }</h1>
        </div>
      </div>
    </div>
  )
}