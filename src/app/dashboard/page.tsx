// import React from 'react';
// import Link from 'next/link';

// export default function DashboardPage() {
//   // --- COLOR PALETTE DEFINITION ---
//   // Using standard Tailwind classes, mapping to a professional Indigo theme.
//   const theme = {
//     primary: 'indigo-600',        // Deep Indigo for main accents/buttons
//     primaryBg: 'bg-indigo-600',
//     primaryHover: 'hover:bg-indigo-700',
//     background: 'bg-gray-100',    // Very light background
//     cardBg: 'bg-white',
//     textMain: 'text-gray-900',    // Dark text for headings
//     textSecondary: 'text-gray-500', // Muted text for descriptions
//     positive: 'text-green-600',
//     negative: 'text-red-600',
//   };

//   // Mock data for dashboard cards
//   const stats = [
//     { name: 'Total Invoices', value: '1,250', change: '+12%', isPositive: true, icon: '📄' },
//     { name: 'Pending Payments', value: '$15,400', change: '-5%', isPositive: false, icon: '💰' },
//     { name: 'Clients Active', value: '128', change: '+3 new', isPositive: true, icon: '👤' },
//   ];
  
//   // Mock data for recent activity
//   const recentInvoices = [
//     { id: 'INV-2024010', amount: '$5,200.00', status: 'Paid', statusColor: theme.positive, date: 'Oct 5' },
//     { id: 'INV-2024011', amount: '$950.00', status: 'Due', statusColor: theme.negative, date: 'Oct 15' },
//     { id: 'INV-2024012', amount: '$3,150.00', status: 'Due', statusColor: theme.negative, date: 'Oct 20' },
//   ];

//   return (
//     <div className={`min-h-screen ${theme.background} p-4 sm:p-6 lg:p-10`}>
      
//       {/* Header and Welcome Message */}
//       <header className="mb-10">
//         <h1 className={`text-3xl font-extrabold ${theme.textMain} sm:text-4xl`}>
//           Dashboard
//         </h1>
//         {/* Mapping your custom class to the new color theme for clarity */}
//         <p className={`text-lg ${theme.textSecondary} mt-1`}>
//           Welcome back! Here's an overview of your billing activity.
//         </p>
//       </header>

//       {/* 1. Key Metrics Section (Grid Cards) */}
//       <section className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
//         {stats.map((item) => (
//           <div 
//             key={item.name} 
//             // Using a full border for a cleaner look, matching the primary color
//             className={`${theme.cardBg} p-6 rounded-xl shadow-lg border-2 border-transparent transition duration-300 hover:border-${theme.primary}`}
//           >
//             <div className="flex items-center justify-between">
//               <p className={`text-sm font-medium ${theme.textSecondary} truncate`}>{item.name}</p>
//               <span className={`text-2xl text-${theme.primary}`}>{item.icon}</span> 
//             </div>
//             <p className={`mt-1 text-3xl font-bold ${theme.textMain}`}>{item.value}</p>
//             <div className={`mt-2 text-sm font-medium ${item.isPositive ? theme.positive : theme.negative}`}>
//               {item.change}
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* 2. Recent Activity Section (Panel) */}
//       <section className={`${theme.cardBg} p-8 rounded-xl shadow-2xl`}>
//         <div className="flex justify-between items-center mb-6 border-b pb-4">
//           <h2 className={`text-2xl font-bold ${theme.textMain}`}>Recent Transactions</h2>
//           {/* Link styled as a secondary action button */}
//           <Link 
//             href="/invoices" 
//             className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${theme.primaryBg} ${theme.primaryHover} transition duration-150`}
//           >
//             View All Invoices
//           </Link>
//         </div>

//         {/* List/Table */}
//         <div className="space-y-4">
//           {recentInvoices.map((invoice) => (
//             <div key={invoice.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
//               {/* Invoice ID and Date */}
//               <div className="flex flex-col">
//                 <p className={`font-semibold ${theme.textMain}`}>{invoice.id}</p>
//                 <p className={`text-sm ${theme.textSecondary}`}>{invoice.date}</p>
//               </div>
              
//               {/* Amount and Status */}
//               <div className="text-right flex items-center space-x-4">
//                 <span className={`text-lg font-bold ${invoice.statusColor}`}>{invoice.amount}</span>
//                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium 
//                                   ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                   {invoice.status}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//     </div>
//   );
// }


// src/app/dashboard/page.tsx

import React from 'react';
import Header from "@/components/layout/Header";

export default function DashboardPage() {
  // Mock data and theme setup for consistency
  const theme = { primary: 'indigo-600', textSecondary: 'text-gray-500', positive: 'text-green-600', negative: 'text-red-600' };
  const stats = [ /* ... stats data ... */ ]; // Reuse stats from earlier
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className={`text-3xl font-extrabold text-${theme.primary} sm:text-4xl`}>
            Dashboard
          </h1>
          <p className={`text-lg ${theme.textSecondary} mt-1`}>
            Overview of your billing activity.
          </p>
        </header>
        
        {/* Dashboard Content Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600">
          <p className="text-gray-700">Analytics and key metrics would go here.</p>
        </div>
      </main>
    </div>
  );
}