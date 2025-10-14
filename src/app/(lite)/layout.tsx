

// // src/app/(lite)/layout.tsx
// 'use client';

// import React, { useState } from 'react';
// import { Sidebar, MobileHeader } from '@/components/SideBar';
// import { BottomNavBar } from '@/components/BottomNav';

// export default function AppLayout({
//   children,
// }: {
//   children: React.ReactNode;  
// }) {
//   // 1. Manage the state for the mobile sidebar in the layout
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* 2. Pass the state and setter function to the Sidebar */}
//       <Sidebar 
//         isMobileOpen={isMobileOpen} 
//         setIsMobileOpen={setIsMobileOpen} 
//       />

//       <div className="flex-1 flex flex-col">
//         {/* 3. Render the MobileHeader and provide a function to open the sidebar */}
//         <MobileHeader 
//           isMobileOpen={isMobileOpen} 
//           onMenuClick={() => setIsMobileOpen(true)} 
//         />
        
//         {/* Main content with padding to avoid overlap with fixed mobile header/footer */}
//         <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
//           {children}
//         </main>
//       </div>
      
//       <BottomNavBar />
//     </div>
//   );
// }


// src/app/(lite)/layout.tsx
'use client';

import React, { useState } from 'react';
import { Sidebar, MobileHeader } from '@/components/SideBar';
import { BottomNavBar } from '@/components/BottomNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;  
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />

      <div className="flex-1 flex flex-col">
        {/* CORRECTED: Removed the isMobileOpen prop from MobileHeader */}
        <MobileHeader 
          onMenuClick={() => setIsMobileOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
          {children}
        </main>
      </div>
      
      <BottomNavBar />
    </div>
  );
}