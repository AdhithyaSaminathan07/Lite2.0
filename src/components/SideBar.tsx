'use client';

// Fix all "window" TypeScript errors
declare const window: any;

import Link from 'next/link';
import { Home, Package, Settings, X, CreditCard, Menu, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

type SidebarProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
};

type MobileHeaderProps = {
  onMenuClick: () => void;
  isMobileOpen: boolean;
};

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-indigo-50 text-indigo-700 font-semibold border-r-2 border-indigo-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const router = useRouter();

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear any saved session or token
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    router.push('/'); // redirect to login page
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 w-64 h-full bg-white border-r z-50 
                    flex flex-col transform transition-transform duration-300 ease-in-out
                    lg:relative lg:translate-x-0
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Billzy Lite</h1>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="flex flex-col space-y-1 flex-grow p-4">
          <NavLink href="/dashboard" onClick={handleLinkClick}>
            <Home className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink href="/inventory" onClick={handleLinkClick}>
            <Package className="w-5 h-5 mr-3" />
            <span>Inventory</span>
          </NavLink>

          <NavLink href="/billing" onClick={handleLinkClick}>
            <CreditCard className="w-5 h-5 mr-3" />
            <span>Billing</span>
          </NavLink>

          <NavLink href="/settings" onClick={handleLinkClick}>
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </NavLink>          
        </nav>

        {/* Logout section */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileHeader({ onMenuClick, isMobileOpen }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-30 h-14 flex items-center px-4 shadow-sm">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
        aria-label="Open menu"
        aria-controls="sidebar"
        aria-expanded={isMobileOpen}
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900">Billzy Lite</h1>
    </header>
  );
}
