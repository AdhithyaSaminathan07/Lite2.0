// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Package, Settings, CreditCard } from 'lucide-react';

// const navItems = [
//   { href: '/dashboard', icon: Home, label: 'Dashboard' },
//   { href: '/inventory', icon: Package, label: 'Inventory' },
//   { href: '/billing', icon: CreditCard, label: 'Billing' },
//   { href: '/settings', icon: Settings, label: 'Settings' },
// ];

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
//   const isActive = pathname === href;

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
  CreditCard,
  Clock, // ✅ Added for Billing History
} from 'lucide-react';

//=========== NAV ITEMS ===========//
const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/billing', icon: CreditCard, label: 'Billing' },
  { href: '/billing-history', icon: Clock, label: 'History' }, // ✅ New item
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

  // ✅ Highlight active link (works even for nested routes)
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium mt-1">{label}</span>
    </Link>
  );
}

//=========== MAIN COMPONENT ===========//
export function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 h-16 flex lg:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </nav>
  );
}
