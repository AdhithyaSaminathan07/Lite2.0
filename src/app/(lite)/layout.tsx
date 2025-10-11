

// // // src/app/dashboard/layout.tsx
// 'use client';

// import { useState } from 'react';
// import { Sidebar, MobileHeader } from '@/components/SideBar';
// // import './globals.css'; // Ensure global styles are imported

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   return (
//     <html lang="en">
//       <body className="bg-gray-50">
//         <div className="flex h-screen overflow-hidden">
//           {/* Sidebar - It's always in the DOM, but its visibility is controlled internally */}
//           <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
          
//           {/* Main Content Area */}
//           <div className="flex-1 flex flex-col min-w-0">
//             {/* Mobile Header - Only visible on mobile */}
//             <MobileHeader 
//               onMenuClick={() => setIsMobileOpen(true)}
//               isMobileOpen={isMobileOpen} 
//             />
            
//             {/* The {children} prop is where Next.js will render the content of your pages */}
//             <main className="flex-1 overflow-y-auto lg:mt-0 mt-14 p-4 lg:p-6">
//               {children}
//             </main>
//           </div>
//         </div>
//       </body>
//     </html>
//   );
// }

import { Sidebar } from '@/components/SideBar';
import { BottomNavBar } from '@/components/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- Desktop Sidebar --- */}
      <Sidebar />

      {/* --- Main Content --- */}
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        {children}
      </main>
      
      {/* --- Mobile Bottom Navigation --- */}
      <BottomNavBar />
    </div>
  );
}