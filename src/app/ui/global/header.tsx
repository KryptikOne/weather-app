"use client";
import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowRightStartOnRectangleIcon, Bars3Icon, BellIcon, ChartBarIcon, Cog8ToothIcon, HomeIcon, UserCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import clsx from 'clsx'
import LogoImage from "@/app/ui/assets/img/clouds-emoji-favicon.png";
import Avatar from "@/app/ui/assets/img/avatar-hooded.jpg";
import NavLinks from "@/app/ui/global/nav-links";

const links = [
	{ name: "Home", slug: "home", href: "/", icon: HomeIcon },
	{ name: "Dashboard", slug: "dashboard", href: "/dashboard", icon: ChartBarIcon },
];

export default function Header() {
	const pathname = usePathname();

	return (
		<Disclosure as="nav" className="bg-gray-800">
			<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
						{/* Mobile menu button*/}
						<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
							<XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
						</DisclosureButton>
					</div>
					<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
						<div className="flex shrink-0 items-center">
							<Image src={LogoImage} width={512} height={512} alt="Logo Image" className="h-8 w-auto" />
						</div>
						<div className="hidden sm:ml-6 sm:block">
							<div className="flex space-x-4">
								<NavLinks />
							</div>
						</div>
					</div>
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
						<button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
							<span className="absolute -inset-1.5" />
							<span className="sr-only">View notifications</span>
							<BellIcon aria-hidden="true" className="size-6" />
						</button>

						{/* BEGIN Profile Dropdown */}
						<Menu as="div" className="relative ml-3">
							<div>
								<MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
									<span className="absolute -inset-1.5" />
									<span className="sr-only">Open user menu</span>
									<Image width={32} height={32} src={Avatar} className="size-8 rounded-full" alt="Avatar" />
								</MenuButton>
							</div>
							<MenuItems transition className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
								<MenuItem>
									<a href="#" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden">
										<UserCircleIcon aria-hidden="true" className="w-5 inline" /> Your Profile
									</a>
								</MenuItem>
								<MenuItem>
									<a href="#" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden">
										<Cog8ToothIcon aria-hidden="true" className="w-5 inline" /> Settings
									</a>
								</MenuItem>
								<MenuItem>
									<a href="#" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden">
										<ArrowRightStartOnRectangleIcon aria-hidden="true" className="w-5 inline" /> Sign out
									</a>
								</MenuItem>
							</MenuItems>
						</Menu>
						{/* END Profile Dropdown */}
					</div>
				</div>
			</div>

			<DisclosurePanel className="sm:hidden">
				<div className="space-y-1 px-2 pt-2 pb-3">
					{links.map((item) => (
						<DisclosureButton
							key={item.name}
							as="a"
							href={item.href}
							// aria-current={item.current ? 'page' : undefined}
							// className={clsx("text-gray-300 hover:bg-gray-700 hover:text-white", `block rounded-md px-3 py-2 text-base font-medium`, { "bg-gray-900 text-white": pathname === item.href })}
						>
							{item.name}
						</DisclosureButton>
					))}
				</div>
			</DisclosurePanel>
		</Disclosure>
	);
}
