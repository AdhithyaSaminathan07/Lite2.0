// "use client";

// import { useState, useEffect } from "react";

// // Define a type for the sales data for better type-safety
// type SalesData = {
//   total: number;
//   cash: number;
//   qr: number;
//   bills: number;
//   lastUpdated: string;
// };

// export default function DashboardComponent() {
//   // Initialize state with the defined type
//   const [salesData, setSalesData] = useState<SalesData>({
//     total: 0,
//     cash: 0,
//     qr: 0,
//     bills: 0,
//     lastUpdated: "",
//   });

//   // This useEffect hook handles data fetching and automatic refreshing.
//   useEffect(() => {
//     // This async function fetches the latest sales data from your API endpoint.
//     const fetchSales = async () => {
//       try {
//         // Replace '/api/sales' with your actual API endpoint if it's different.
//         const res = await fetch("/api/sales");

//         if (!res.ok) {
//           // If the server response is not OK, throw an error to be caught below.
//           throw new Error(`Failed to fetch: ${res.status}`);
//         }
//         const data: SalesData = await res.json();
//         setSalesData(data); // Update the component's state with the new data.
//       } catch (err) {
//         // Log any errors to the console for debugging.
//         console.error("Failed to load sales data:", err);
//       }
//     };

//     // 1. Initial Fetch: Call fetchSales immediately when the component first loads.
//     fetchSales();

//     // 2. Auto-Refresh: Set up an interval to call fetchSales again every 15 seconds.
//     const interval = setInterval(fetchSales, 15000); // 15000 milliseconds = 15 seconds

//     // 3. Cleanup Function: This function runs when the component is unmounted
//     // (e.g., user navigates to another page). It stops the interval to prevent
//     // memory leaks and unnecessary API calls.
//     return () => clearInterval(interval);
//   }, []); // The empty dependency array [] ensures this effect runs only once on mount.

//   // --- JSX for Rendering the Component ---
//   return (
//     // Main container: sets a light gray background and uses flexbox to center the card.
//     // Responsive padding is added: p-4 on small screens, sm:p-8 on larger screens.
//     // pt-12 and sm:pt-20 add more padding at the top to position the card nicely.
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 sm:p-8 pt-12 sm:pt-20">
//       {/* Sales Card: white background, rounded corners, and a subtle shadow.
//           w-full ensures it takes the full width on mobile.
//           max-w-sm constrains its width on larger screens for better readability.
//           p-6 provides consistent internal padding. */}
//       <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
//         {/* Card Header */}
//         <h3 className="text-lg font-bold text-gray-800 mb-4">
//           Today’s Sales
//         </h3>

//         {/* Sales Details Section: space-y-3 adds vertical space between each item. */}
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <p className="text-gray-600 text-sm">Total Sales</p>
//             <p className="font-bold text-gray-900">₹{salesData.total}</p>
//           </div>

//           <div className="flex justify-between items-center">
//             <p className="text-gray-600 text-sm">Cash</p>
//             <p className="font-semibold text-green-600">₹{salesData.cash}</p>
//           </div>

//           <div className="flex justify-between items-center">
//             <p className="text-gray-600 text-sm">QR / Online</p>
//             <p className="font-semibold text-blue-600">₹{salesData.qr}</p>
//           </div>
//         </div>

//         {/* Card Footer: A border-t adds a separator line.
//             mt-5 adds margin above the line, and pt-4 adds padding below it. */}
//         <div className="mt-5 flex justify-between border-t pt-4 text-sm text-gray-500">
//           <span>Bills: {salesData.bills}</span>
//           <span>{salesData.lastUpdated}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

// Define types for better type-safety
type SalesData = {
  total: number;
  cash: number;
  qr: number;
  bills: number;
  lastUpdated: string;
};

// Define the possible time periods for the tabs
type Period = "Today" | "Weekly" | "Monthly";

export default function DashboardComponent() {
  const [salesData, setSalesData] = useState<SalesData>({
    total: 0,
    cash: 0,
    qr: 0,
    bills: 0,
    lastUpdated: "",
  });

  // State to manage the currently active tab
  const [activePeriod, setActivePeriod] = useState<Period>("Today");
  const [isLoading, setIsLoading] = useState(true);

  // useEffect now fetches data based on the activePeriod and auto-refreshes.
  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/sales?period=${activePeriod.toLowerCase()}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data: SalesData = await res.json();
        setSalesData(data);
      } catch (err) {
        console.error("Failed to load sales data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
    const interval = setInterval(fetchSales, 15000);
    return () => clearInterval(interval);
  }, [activePeriod]);

  const TABS: Period[] = ["Today", "Weekly", "Monthly"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 sm:p-8 pt-12 sm:pt-20">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        {/* --- THIS IS THE DYNAMIC TITLE --- */}
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {activePeriod === 'Today' ? 'Today’s' : `This ${activePeriod}'s`} Sales
        </h3>
        {/* --- END OF CHANGE --- */}

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActivePeriod(tab)}
              className={`py-2 px-4 text-sm font-medium focus:outline-none ${
                activePeriod === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sales Details Section */}
        {isLoading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">Total Sales</p>
                <p className="font-bold text-gray-900">₹{salesData.total}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">Cash</p>
                <p className="font-semibold text-green-600">₹{salesData.cash}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">QR / Online</p>
                <p className="font-semibold text-blue-600">₹{salesData.qr}</p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-5 flex justify-between border-t pt-4 text-sm text-gray-500">
              <span>Bills: {salesData.bills}</span>
              <span>{salesData.lastUpdated}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}