'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChartBarIcon, Cog6ToothIcon, HomeIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const links = [
  { name: 'Home', slug: 'home', href: '/', icon: HomeIcon },
  { name: 'Dashboard', href: '/dashboard',  icon: ChartBarIcon },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex',
              { 'bg-gray-900 text-white': pathname === link.href },
            )}>
            <LinkIcon className="w-5 mr-1" />
            <p className="hidden lg:block">{link.name}</p>
          </Link>
        )
      })}
    </>
  )
}
