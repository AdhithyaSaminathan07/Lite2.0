"use client";

import { useState, useEffect } from "react";

// Define a type for the sales data for better type-safety
type SalesData = {
  total: number;
  cash: number;
  qr: number;
  bills: number;
  lastUpdated: string;
};

export default function DashboardComponent() {
  // Initialize state with the defined type
  const [salesData, setSalesData] = useState<SalesData>({
    total: 0,
    cash: 0,
    qr: 0,
    bills: 0,
    lastUpdated: "",
  });

  // This useEffect hook handles data fetching and automatic refreshing.
  useEffect(() => {
    // This async function fetches the latest sales data from your API endpoint.
    const fetchSales = async () => {
      try {
        // Replace '/api/sales' with your actual API endpoint if it's different.
        const res = await fetch("/api/sales");

        if (!res.ok) {
          // If the server response is not OK, throw an error to be caught below.
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data: SalesData = await res.json();
        setSalesData(data); // Update the component's state with the new data.
      } catch (err) {
        // Log any errors to the console for debugging.
        console.error("Failed to load sales data:", err);
      }
    };

    // 1. Initial Fetch: Call fetchSales immediately when the component first loads.
    fetchSales();

    // 2. Auto-Refresh: Set up an interval to call fetchSales again every 15 seconds.
    const interval = setInterval(fetchSales, 15000); // 15000 milliseconds = 15 seconds

    // 3. Cleanup Function: This function runs when the component is unmounted
    // (e.g., user navigates to another page). It stops the interval to prevent
    // memory leaks and unnecessary API calls.
    return () => clearInterval(interval);
  }, []); // The empty dependency array [] ensures this effect runs only once on mount.

  // --- JSX for Rendering the Component ---
  return (
    // Main container: sets a light gray background and uses flexbox to center the card.
    // Responsive padding is added: p-4 on small screens, sm:p-8 on larger screens.
    // pt-12 and sm:pt-20 add more padding at the top to position the card nicely.
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 sm:p-8 pt-12 sm:pt-20">
      {/* Sales Card: white background, rounded corners, and a subtle shadow.
          w-full ensures it takes the full width on mobile.
          max-w-sm constrains its width on larger screens for better readability.
          p-6 provides consistent internal padding. */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        {/* Card Header */}
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Today’s Sales
        </h3>

        {/* Sales Details Section: space-y-3 adds vertical space between each item. */}
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

        {/* Card Footer: A border-t adds a separator line.
            mt-5 adds margin above the line, and pt-4 adds padding below it. */}
        <div className="mt-5 flex justify-between border-t pt-4 text-sm text-gray-500">
          <span>Bills: {salesData.bills}</span>
          <span>{salesData.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}