// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import {
//   Home,
//   Package,
//   Settings,
//   CreditCard,
//   Clock, // ✅ Added for Billing History
// } from 'lucide-react';

// //=========== NAV ITEMS ===========//
// const navItems = [
//   { href: '/dashboard', icon: Home, label: 'Dashboard' },
//   { href: '/inventory', icon: Package, label: 'Inventory' },
//   { href: '/billing', icon: CreditCard, label: 'Billing' },
//   { href: '/billing-history', icon: Clock, label: 'History' }, // ✅ New item
//   { href: '/settings', icon: Settings, label: 'Settings' },
// ];

// //=========== NAVLINK COMPONENT ===========//
// function NavLink({
//   href,
//   icon: Icon,
//   label,
// }: {
//   href: string;
//   icon: React.ElementType;
//   label: string;
// }) {
//   const pathname = usePathname();

//   // ✅ Highlight active link (works even for nested routes)
//   const isActive = pathname.startsWith(href);

//   return (
//     <Link
//       href={href}
//       className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
//         isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
//       }`}
//     >
//       <Icon className="w-6 h-6" />
//       <span className="text-xs font-medium mt-1">{label}</span>
//     </Link>
//   );
// }

// //=========== MAIN COMPONENT ===========//
// export function BottomNavBar() {
//   return (
//     <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 h-16 flex lg:hidden">
//       {navItems.map((item) => (
//         <NavLink
//           key={item.href}
//           href={item.href}
//           icon={item.icon}
//           label={item.label}
//         />
//       ))}
//     </nav>
//   );
// }




'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Package,
  Settings,
  Clock,
  ScanLine,
} from 'lucide-react';

//=========== NAV ITEMS ===========//
const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/billing-history', icon: Clock, label: 'History' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

//=========== NAVLINK COMPONENT ===========//
function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-300 ${
        isActive ? 'text-white scale-105' : 'text-indigo-200 hover:text-white'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-[11px] font-medium mt-1">{label}</span>
    </Link>
  );
}

//=========== MAIN COMPONENT ===========//
export function BottomNavBar() {
  const pathname = usePathname();
  const isBilling = pathname.startsWith('/billing');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#5a4fcf] border-t-0 z-40 h-20 flex items-center justify-between px-3 shadow-[0_-2px_8px_rgba(0,0,0,0.2)] rounded-t-2xl lg:hidden">
      {/* Left two items */}
      <div className="flex flex-1 justify-evenly">
        {navItems.slice(0, 2).map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>

      {/* Center big scanner button */}
      <Link
        href="/billing"
        className={`relative bg-white text-[#5a4fcf] rounded-full p-4 shadow-xl transform transition-all duration-300 -translate-y-2 ${
          isBilling ? 'scale-110' : 'hover:scale-105'
        }`}
      >
        <ScanLine className="w-8 h-8" />
      </Link>

      {/* Right two items */}
      <div className="flex flex-1 justify-evenly">
        {navItems.slice(2).map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </nav>
  );
}
