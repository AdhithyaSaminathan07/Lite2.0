

'use client';

import React, { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Home,
  Package,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Clock, // ✅ Added for Billing History
} from 'lucide-react';

//=========== PROPS DEFINITIONS ===========//
interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: Dispatch<SetStateAction<boolean>>;
}

interface MobileHeaderProps {
  onMenuClick: () => void;
}

//=========== NAVLINK COMPONENT ===========//
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

//=========== SIDEBAR COMPONENT ===========//
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
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 h-full w-64 flex-col border-r bg-white z-40 lg:relative lg:flex transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Header with logo */}
        <div className="flex h-14 items-center justify-between border-b p-4">
          <Image
            src="/lite-logo.png"
            alt="BillzzyLite Logo"
            width={120}
            height={30}
            priority
          />
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav
          onClick={handleLinkClick}
          className="flex flex-1 flex-col space-y-1 p-4"
        >
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

          {/* ✅ New Billing History link */}
          <NavLink href="/billing-history">
            <Clock className="mr-3 h-5 w-5" />
            <span>Billing History</span>
          </NavLink>

          <NavLink href="/settings">
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
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

//=========== MOBILEHEADER COMPONENT ===========//
export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between border-b bg-white px-4 shadow-sm lg:hidden">
      <Image
        src="/lite-logo.png"
        alt="BillzzyLite Logo"
        width={110}
        height={28}
        priority
      />
      <button
        onClick={onMenuClick}
        className="text-gray-600 hover:text-gray-900"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
