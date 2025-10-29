<<<<<<< HEAD
=======


>>>>>>> friend/LIte-GoWhats
'use client';

import React, { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
<<<<<<< HEAD
import Image from 'next/image'; // <-- Import the Image component
import {
  Home,
  Package,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
=======
import { Home, Package, Settings, CreditCard, LogOut, Menu, X } from 'lucide-react';
>>>>>>> friend/LIte-GoWhats

//=========== PROPS DEFINITIONS ===========//
// 1. Define the props for the Sidebar component
interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

// 2. Define the props for the MobileHeader component
interface MobileHeaderProps {
  onMenuClick: () => void;
}

<<<<<<< HEAD
=======

>>>>>>> friend/LIte-GoWhats
//=========== NAVLINK COMPONENT (No changes needed) ===========//
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
        isActive
          ? 'bg-indigo-50 text-indigo-700 font-semibold border-r-2 border-indigo-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  );
}

<<<<<<< HEAD
//=========== SIDEBAR COMPONENT (Updated with Logo) ===========//
=======

//=========== SIDEBAR COMPONENT (Corrected) ===========//
// 3. Apply the props to the Sidebar function
>>>>>>> friend/LIte-GoWhats
export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    router.push('/');
  };

  // Close the sidebar when a nav link is clicked on mobile
  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile view, closes sidebar on click */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      {/* The actual sidebar */}
      <aside
        id="sidebar"
<<<<<<< HEAD
=======
        // 4. Use isMobileOpen to control visibility on mobile screens
>>>>>>> friend/LIte-GoWhats
        className={`fixed top-0 left-0 h-full w-64 flex-col border-r bg-white z-40 lg:relative lg:flex transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
<<<<<<< HEAD
        <div className="flex h-14 items-center justify-between border-b p-4">
          {/* Logo instead of text */}
          <Image
            src="/lite-logo.png"
            alt="BillzzyLite Logo"
            width={120} // Adjust width as needed
            height={30} // Adjust height as needed
            priority // Add priority to preload the logo
          />
          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
=======
        <div className="flex items-center justify-between border-b p-4">
          <h1 className="text-xl font-bold text-indigo-600">BillzzyLite</h1>
          {/* Mobile close button */}
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-800">
>>>>>>> friend/LIte-GoWhats
            <X size={24} />
          </button>
        </div>

<<<<<<< HEAD
        <nav
          onClick={handleLinkClick}
          className="flex flex-1 flex-col space-y-1 p-4"
        >
=======
        <nav onClick={handleLinkClick} className="flex flex-1 flex-col space-y-1 p-4">
>>>>>>> friend/LIte-GoWhats
          <NavLink href="/dashboard">
            <Home className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink href="/inventory">
            <Package className="mr-3 h-5 w-5" />
            <span>Inventory</span>
          </NavLink>
          <NavLink href="/billing">
            <CreditCard className="mr-3 h-5 w-5" />
            <span>Billing</span>
          </NavLink>
          <NavLink href="/settings">
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="border-t p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-lg px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

<<<<<<< HEAD
//=========== MOBILEHEADER COMPONENT (Updated with Logo) ===========//
export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm lg:hidden">
      {/* Logo instead of text */}
      <Image
        src="/lite-logo.png"
        alt="BillzzyLite Logo"
        width={110} // Adjust width as needed
        height={28} // Adjust height as needed
        priority
      />
      {/* The hamburger menu button */}
      <button
        onClick={onMenuClick}
        className="text-gray-600 hover:text-gray-900"
      >
=======

//=========== MOBILEHEADER COMPONENT (Corrected) ===========//
// 5. Apply the props to the MobileHeader function
export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm lg:hidden">
      <h1 className="text-lg font-semibold text-gray-900">BillzzyLite</h1>
      {/* The hamburger menu button */}
      <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900">
>>>>>>> friend/LIte-GoWhats
        <Menu size={24} />
      </button>
    </header>
  );
}