// // src/components/Sidebar.tsx
// 'use client';

// import Link from 'next/link';
// import { Home, Package, Settings, X, CreditCard } from 'lucide-react';

// // Props for the Sidebar, including state for mobile view
// type SidebarProps = {
//   isMobileOpen: boolean;
//   setIsMobileOpen: (isOpen: boolean) => void;
// };

// // Reusable NavLink component
// function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
//   return (
//     <Link
//       href={href}
//       className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
//     >
//       {children}
//     </Link>
//   );
// }

// export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
//   return (
//     <>
//       {/* Overlay for mobile (dims the background when sidebar is open) */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
//           isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={() => setIsMobileOpen(false)}
//       ></div>

//       {/* Sidebar Container */}
//       <aside
//         className={`fixed top-0 left-0 w-64 h-full bg-white border-r p-4 z-40 
//                    flex flex-col
//                    transform transition-transform md:relative md:translate-x-0
//                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
//       >
//         {/* Sidebar Header */}
//         <div className="flex justify-between items-center md:justify-start mb-6">
//           <h1 className="text-2xl font-bold text-indigo-600 px-4">Billzy Lite</h1>
//           {/* Mobile-only close button */}
//           <button onClick={() => setIsMobileOpen(false)} className="md:hidden p-1">
//             <X className="w-6 h-6" />
//           </button>
//         </div>
        
//         {/* Main Navigation Links */}
//         <nav className="flex flex-col space-y-2 flex-grow">
//           <NavLink href="/dashboard">
//             <Home className="w-5 h-5 mr-3" />
//             Dashboard
//           </NavLink>
//           <NavLink href="/inventory">
//             <Package className="w-5 h-5 mr-3" />
//             Inventory
//           </NavLink>
//           <NavLink href="/billing">
//             <CreditCard className="w-5 h-5 mr-3" />
//             Billing
//           </NavLink>
//         </nav>

//         {/* Bottom Navigation Link (Settings) */}
//         <div>
//           <NavLink href="/settings">
//             <Settings className="w-5 h-5 mr-3" />
//             Settings
//           </NavLink>
//         </div>
//       </aside>
//     </>
//   );
// }


// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { Home, Package, Settings, X, CreditCard, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Props for the Sidebar component
type SidebarProps = {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
};

// Props for the MobileHeader component, now includes isMobileOpen for ARIA attributes
type MobileHeaderProps = {
  onMenuClick: () => void;
  isMobileOpen: boolean;
};

/**
 * A navigation link component that visually indicates the active page.
 * It also accepts an onClick handler to perform actions, like closing the sidebar on mobile.
 */
function NavLink({ 
  href, 
  children, 
  onClick 
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

/**
 * The main sidebar component. It is responsive and acts as a static sidebar on desktop
 * and a slide-out menu on mobile.
 */
export function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {

  // Handler to close the sidebar when a link is clicked on mobile devices.
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  // Effect to handle closing the mobile sidebar if the window is resized to desktop width.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Cleanup the event listener when the component unmounts.
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  return (
    <>
      {/* Overlay for mobile view, which closes the sidebar when clicked */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <aside
        id="sidebar" // Added ID for ARIA control
        className={`fixed top-0 left-0 w-64 h-full bg-white border-r z-50 
                   flex flex-col transform transition-transform duration-300 ease-in-out
                   lg:relative lg:translate-x-0
                   ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-bold text-indigo-600">Billzy Lite</h1>
          
          {/* Mobile-only close button with accessibility label */}
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Main Navigation Links */}
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
        </nav>

        {/* Bottom Navigation Link (Settings) */}
        <div className="p-4 border-t">
          <NavLink href="/settings" onClick={handleLinkClick}>
            <Settings className="w-5 h-5 mr-3" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

/**
 * The header component for mobile view, containing the hamburger menu button.
 */
export function MobileHeader({ onMenuClick, isMobileOpen }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-30 h-14 flex items-center px-4 shadow-sm">
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
        aria-label="Open menu"
        aria-controls="sidebar" // Connects button to the sidebar
        aria-expanded={isMobileOpen} // Indicates if the sidebar is open or closed
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900">Billzy Lite</h1>
    </header>
  );
}