// src/components/layout/Header.tsx

import Link from "next/link";
import React from 'react';

export default function Header() {
  const theme = {
    bg: 'bg-white',
    shadow: 'shadow-lg',
    brandColor: 'text-indigo-600',
    primaryLink: 'text-gray-600 hover:text-indigo-600',
    buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
    buttonText: 'text-white',
  };

  return (
    <header className={`sticky top-0 z-50 ${theme.bg} ${theme.shadow} p-4`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        
        {/* Logo/Brand Name */}
        <Link 
          href="/" 
          className={`text-2xl font-extrabold ${theme.brandColor} transition-colors duration-200`}
        >
          Billzzy Lite
        </Link>
        
        {/* DESKTOP NAVIGATION (Visible on medium screens and up) */}
        <nav className="hidden md:flex items-center space-x-6">
          
          <Link href="/dashboard" className={`font-medium ${theme.primaryLink}`}>
            Dashboard
          </Link>
          <Link href="/inventory" className={`font-medium ${theme.primaryLink}`}>
            Inventory
          </Link>
          <Link href="/billing" className={`font-medium ${theme.primaryLink}`}>
            Billing
          </Link>
          <Link href="/settings" className={`font-medium ${theme.primaryLink}`}>
            Settings
          </Link>
          
          {/* Sign Up Link styled as a prominent button */}
          <Link 
            href="/auth?mode=register" 
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 
                       ${theme.buttonBg} ${theme.buttonText} shadow-md hover:shadow-lg`}
          >
            Sign Up
          </Link>
        </nav>

        {/* MOBILE MENU BUTTON (Visible only on small screens) */}
        <button 
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Menu"
        >
          {/* Hamburger Icon Placeholder */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-6 w-6 ${theme.brandColor}`}>
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
        </button>

      </div>
    </header>
  );
}