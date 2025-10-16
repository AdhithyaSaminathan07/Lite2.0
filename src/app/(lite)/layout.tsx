

// // // src/app/(lite)/layout.tsx
// // 'use client';

// // import React, { useState } from 'react';
// // import { Sidebar, MobileHeader } from '@/components/SideBar';
// // import { BottomNavBar } from '@/components/BottomNav';

// // export default function AppLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;  
// // }) {
// //   // 1. Manage the state for the mobile sidebar in the layout
// //   const [isMobileOpen, setIsMobileOpen] = useState(false);

// //   return (
// //     <div className="flex h-screen bg-gray-50">
// //       {/* 2. Pass the state and setter function to the Sidebar */}
// //       <Sidebar 
// //         isMobileOpen={isMobileOpen} 
// //         setIsMobileOpen={setIsMobileOpen} 
// //       />

// //       <div className="flex-1 flex flex-col">
// //         {/* 3. Render the MobileHeader and provide a function to open the sidebar */}
// //         <MobileHeader 
// //           isMobileOpen={isMobileOpen} 
// //           onMenuClick={() => setIsMobileOpen(true)} 
// //         />
        
// //         {/* Main content with padding to avoid overlap with fixed mobile header/footer */}
// //         <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
// //           {children}
// //         </main>
// //       </div>
      
// //       <BottomNavBar />
// //     </div>
// //   );
// // }


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
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <Sidebar 
//         isMobileOpen={isMobileOpen} 
//         setIsMobileOpen={setIsMobileOpen} 
//       />

//       <div className="flex-1 flex flex-col">
//         {/* CORRECTED: Removed the isMobileOpen prop from MobileHeader */}
//         <MobileHeader 
//           onMenuClick={() => setIsMobileOpen(true)} 
//         />
        
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

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // <-- Import useSession
import { useRouter } from 'next/navigation'; // <-- Import useRouter
import { Sidebar, MobileHeader } from '@/components/SideBar';
import { BottomNavBar } from '@/components/BottomNav';

// A loading component to show while checking the session
function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session, status } = useSession(); // <-- Get session status
  const router = useRouter();

  // This effect will run when the session status changes.
  useEffect(() => {
    // If the session is still loading, we don't do anything yet.
    if (status === 'loading') {
      return;
    }

    // If the user is not authenticated, redirect them to the login page.
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]); // <-- Dependencies for the effect

  // While the session is loading, show a loading indicator.
  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  // If the user is authenticated, render the layout and the page content.
  if (status === 'authenticated') {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
        />
        <div className="flex-1 flex flex-col">
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

  // If the user is not authenticated and not loading, render nothing.
  // The useEffect hook will handle the redirect.
  return null;
}