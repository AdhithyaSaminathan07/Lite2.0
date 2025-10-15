
// // Example path: src/components/dashboard.tsx

// "use client";

// import { useState, useEffect } from "react";

// export default function DashboardComponent() {
//   const [salesData, setSalesData] = useState({
//     total: 0,
//     cash: 0,
//     qr: 0,
//     bills: 0,
//     lastUpdated: "",
//   });

//   // --- MODIFICATION START ---
//   // This useEffect now automatically refreshes the data every 15 seconds.
//   useEffect(() => {
//     // This function fetches the latest sales data from your API
//     const fetchSales = async () => {
//       try {
//         const res = await fetch("/api/sales");
//         if (!res.ok) {
//           throw new Error(`Failed to fetch: ${res.status}`);
//         }
//         const data = await res.json();
//         setSalesData(data);
//       } catch (err) {
//         console.error("Failed to load sales data:", err);
//       }
//     };

//     fetchSales(); // 1. Fetch data immediately when the component first loads.

//     // 2. Set up an interval to call fetchSales again every 15 seconds.
//     const interval = setInterval(fetchSales, 15000); // 15000 milliseconds

//     // 3. This is a cleanup function. It runs when the component is removed
//     // from the page to stop the interval, preventing memory leaks.
//     return () => clearInterval(interval);
//   }, []); // The empty array [] ensures this setup only runs once.
//   // --- MODIFICATION END ---

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 pt-10">
//       <div className="w-full bg-white rounded-2xl shadow p-5 max-w-sm">
//         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//           Today’s Sales
//         </h3>

//         <div className="flex justify-between items-center mb-2">
//           <p className="text-gray-600 text-sm">Total Sales</p>
//           <p className="font-semibold text-gray-900">₹{salesData.total}</p>
//         </div>

//         <div className="flex justify-between items-center mb-1">
//           <p className="text-gray-600 text-sm">Cash</p>
//           <p className="font-medium text-green-600">₹{salesData.cash}</p>
//         </div>

//         <div className="flex justify-between items-center">
//           <p className="text-gray-600 text-sm">QR / Online</p>
//           <p className="font-medium text-blue-600">₹{salesData.qr}</p>
//         </div>

//         <div className="mt-4 flex justify-between border-t pt-3 text-sm text-gray-500">
//           <span>Bills: {salesData.bills}</span>
//           <span>{salesData.lastUpdated}</span>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";

export default function DashboardComponent() {
  const [salesData, setSalesData] = useState({
    total: 0,
    cash: 0,
    qr: 0,
    bills: 0,
    lastUpdated: "",
  });

  // This useEffect now automatically refreshes the data every 15 seconds.
  useEffect(() => {
    // This function fetches the latest sales data from your API
    const fetchSales = async () => {
      try {
        const res = await fetch("/api/sales");
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        setSalesData(data);
      } catch (err) {
        console.error("Failed to load sales data:", err);
      }
    };

    fetchSales(); // 1. Fetch data immediately when the component first loads.

    // 2. Set up an interval to call fetchSales again every 15 seconds.
    const interval = setInterval(fetchSales, 15000); // 15000 milliseconds

    // 3. This is a cleanup function. It runs when the component is removed
    // from the page to stop the interval, preventing memory leaks.
    return () => clearInterval(interval);
  }, []); // The empty array [] ensures this setup only runs once.

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
          Today’s Sales
        </h3>

        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-600 text-base sm:text-lg">Total Sales</p>
          <p className="font-semibold text-gray-900 text-lg sm:text-xl">₹{salesData.total}</p>
        </div>

        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600 text-base">Cash</p>
          <p className="font-medium text-green-600 text-lg">₹{salesData.cash}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-base">QR / Online</p>
          <p className="font-medium text-blue-600 text-lg">₹{salesData.qr}</p>
        </div>

        <div className="mt-6 flex justify-between border-t pt-4 text-base text-gray-500">
          <span>Bills: {salesData.bills}</span>
          <span>{salesData.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}