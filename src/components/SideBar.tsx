'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Settings, CreditCard, LogOut, X, Menu } from 'lucide-react'; // Added X and Menu imports

// Define the types for the props your Sidebar will receive
interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

function NavLink({
  href,
  children,
  onClick, // Accept an onClick handler
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void; // Define its type
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick} // Apply the onClick handler
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

// Sidebar now accepts props
export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    // This check is good practice
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    router.push('/');
  };

  // Define the function to close the sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none' // This will now work
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
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`} // This will also work
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Billzy Lite</h1>
          <button
            onClick={() => setIsMobileOpen(false)} // This now correctly uses the prop
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

// Define props for MobileHeader
interface MobileHeaderProps {
  onMenuClick: () => void;
  isMobileOpen: boolean;
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