

// 'use client';

// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// // MODIFIED: Menu and X icons are removed as they are no longer used.
// import { Home, Package, Settings, CreditCard, LogOut } from 'lucide-react'; 

// // MODIFIED: Sidebar no longer needs props to manage mobile state.
// interface SidebarProps {}

// // MODIFIED: The 'onClick' prop, which was for mobile, has been removed.
// function NavLink({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const isActive = pathname === href;

//   return (
//     <Link
//       href={href}
//       className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
//         isActive
//           ? 'bg-indigo-50 text-indigo-700 font-semibold border-r-2 border-indigo-600'
//           : 'text-gray-700 hover:bg-gray-100'
//       }`}
//     >
//       {children}
//     </Link>
//   );
// }

// export function Sidebar({}: SidebarProps) {
//   const router = useRouter();

//   const handleLogout = () => {
//     if (typeof window !== 'undefined') {
//       window.localStorage.clear();
//     }
//     router.push('/');
//   };

//   // REMOVED: All mobile-specific logic (overlay, state handlers) is gone.
//   return (
//     // --- THIS IS THE KEY FIX ---
//     // 'hidden' hides it on mobile.
//     // 'lg:flex' and 'lg:relative' makes it a visible, in-flow column on desktop, restoring your layout.
//     <aside
//       id="sidebar"
//       className="hidden w-64 flex-col border-r bg-white lg:relative lg:flex"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between border-b p-4">
//         <h1 className="text-xl font-bold text-indigo-600">BillzzyLite</h1>
//         {/* REMOVED: Mobile close button. */}
//       </div>

//       {/* Main navigation */}
//       <nav className="flex flex-1 flex-col space-y-1 p-4">
//         <NavLink href="/dashboard">
//           <Home className="mr-3 h-5 w-5" />
//           <span>Dashboard</span>
//         </NavLink>

//         <NavLink href="/inventory">
//           <Package className="mr-3 h-5 w-5" />
//           <span>Inventory</span>
//         </NavLink>

//         <NavLink href="/billing">
//           <CreditCard className="mr-3 h-5 w-5" />
//           <span>Billing</span>
//         </NavLink>

//         <NavLink href="/settings">
//           <Settings className="mr-3 h-5 w-5" />
//           <span>Settings</span>
//         </NavLink>
//       </nav>

//       {/* Logout section */}
//       <div className="border-t p-4">
//         <button
//           onClick={handleLogout}
//           className="flex w-full items-center rounded-lg px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
//         >
//           <LogOut className="mr-3 h-5 w-5" />
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

// // MODIFIED: Props related to opening/closing the menu are no longer needed.
// interface MobileHeaderProps {}

// // MODIFIED: The header is now a simple, static bar for mobile only.
// export function MobileHeader({}: MobileHeaderProps) {
//   return (
//     <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center border-b bg-white px-4 shadow-sm lg:hidden">
//       {/* REMOVED: The hamburger menu button. */}
//       <h1 className="text-lg font-semibold text-gray-900">BillzzyLite</h1>
//     </header>
//   );
// }


'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Package, Settings, CreditCard, LogOut } from 'lucide-react';

// The NavLink component is correct as is.
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

// ✅ FIX: Removed the unused props parameter '{}' from the function signature.
// The SidebarProps type alias is no longer needed.
export function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.clear();
    }
    router.push('/');
  };

  return (
    <aside
      id="sidebar"
      className="hidden w-64 flex-col border-r bg-white lg:relative lg:flex"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-bold text-indigo-600">BillzzyLite</h1>
      </div>

      {/* Main navigation */}
      <nav className="flex flex-1 flex-col space-y-1 p-4">
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

      {/* Logout section */}
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
  );
}


// ✅ FIX: Removed the unused props parameter '{}' from the function signature.
// The MobileHeaderProps type alias is no longer needed.
export function MobileHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center border-b bg-white px-4 shadow-sm lg:hidden">
      <h1 className="text-lg font-semibold text-gray-900">BillzzyLite</h1>
    </header>
  );
}