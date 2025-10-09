// // src/components/Settings.tsx
// export default function Settings() {
//   return (
//     <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
//       {/* Page Header */}
//       <div className="sm:flex sm:items-center">
//         <div className="sm:flex-auto">
//           <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
//           <p className="mt-2 text-sm text-gray-700">
//             Manage your account settings and set your preferences.
//           </p>
//         </div>
//       </div>

//       {/* Settings Sections */}
//       <div className="mt-8 space-y-6">

//         {/* Profile Settings Card */}
//         <div className="bg-white shadow sm:rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg font-medium leading-6 text-gray-900">
//               User Profile
//             </h3>
//             <div className="mt-2 max-w-xl text-sm text-gray-500">
//               <p>Update your personal and account information.</p>
//             </div>
//             <div className="mt-5">
//               <button
//                 type="button"
//                 className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Notification Settings Card */}
//         <div className="bg-white shadow sm:rounded-lg">
//           <div className="px-4 py-5 sm:p-6">
//             <h3 className="text-lg font-medium leading-6 text-gray-900">
//               Notifications
//             </h3>
//             <div className="mt-2 max-w-xl text-sm text-gray-500">
//               <p>Manage how you receive notifications from us.</p>
//             </div>
//              <div className="mt-5">
//               <button
//                 type="button"
//                 className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
//               >
//                 Manage Notifications
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';

// --- Utility Icons (Simulated Lucide Icons for Single File Component) ---
const User = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const Bell = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
);


export default function Settings() {

  // Simple placeholder functions for button actions
  // Using console.log instead of alert per instructions (no alert())
  const handleEditProfile = () => {
    console.log("Profile editing feature coming soon!");
  };

  const handleManageNotifications = () => {
    console.log("Notification management panel is being built!");
  };
  
  // handleExportData function removed


  return (
    // Changed main container to use a white background for the clean, list-style look
    <div className="min-h-screen bg-white p-4 sm:p-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#5a4fcf' }}>
          App Settings
        </h1>
        <p className="mt-2 text-md text-gray-600">
          Customize your experience and manage application preferences.
        </p>
      </div>

      {/* Settings List - Simple, detail-oriented layout */}
      <div className="mt-8 divide-y divide-gray-200">

        {/* 1. User Profile Section */}
        <div className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-start justify-between">
          
          {/* Details Column (Left/Top) */}
          <div className="sm:w-3/5 lg:w-2/3">
            <div className="flex items-center space-x-4">
              <User className="w-8 h-8 flex-shrink-0" style={{ color: '#5a4fcf' }} />
              <div>
                <h3 className="text-xl font-semibold leading-7 text-gray-900">
                  User Profile
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal details, change your avatar, and manage account security information.
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Column (Right/Bottom) */}
          <div className="mt-4 sm:mt-0 sm:w-2/5 lg:w-1/3 sm:text-right">
            <button
              type="button"
              onClick={handleEditProfile}
              // Styled as a primary text link for the cleaner design
              className="text-sm font-semibold hover:underline rounded-md px-3 py-1.5 transition duration-150 ease-in-out"
              style={{ color: '#5a4fcf', border: '1px solid #5a4fcf' }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* 2. Notification Settings Section */}
        <div className="py-6 sm:py-8 flex flex-col sm:flex-row sm:items-start justify-between">
          
          {/* Details Column (Left/Top) */}
          <div className="sm:w-3/5 lg:w-2/3">
            <div className="flex items-center space-x-4">
              <Bell className="w-8 h-8 flex-shrink-0" style={{ color: '#5a4fcf' }} />
              <div>
                <h3 className="text-xl font-semibold leading-7 text-gray-900">
                  Notifications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Control what alerts you receive for new bills, stock low warnings, and important announcements.
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Column (Right/Bottom) */}
          <div className="mt-4 sm:mt-0 sm:w-2/5 lg:w-1/3 sm:text-right">
            <button
              type="button"
              onClick={handleManageNotifications}
              className="text-sm font-semibold hover:underline rounded-md px-3 py-1.5 transition duration-150 ease-in-out"
              style={{ color: '#5a4fcf', border: '1px solid #5a4fcf' }}
            >
              Manage Notifications
            </button>
          </div>
        </div>
        
        {/* Data & Export section removed */}

      </div>
    </div>
  );
}
