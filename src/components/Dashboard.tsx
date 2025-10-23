
// // src/components/Dashboard.tsx

// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { Package, AlertTriangle, XCircle, Loader2 } from "lucide-react";

// // --- TYPE DEFINITIONS ---
// type SalesData = {
//   total: number;
//   cash: number;
//   qr: number;
//   bills: number;
//   lastUpdated: string;
// };

// interface Product {
//   id: string;
//   name: string;
//   quantity: number;
//   lowStockThreshold?: number;
// }

// type InventorySummary = {
//   inStock: number;
//   lowStock: number;
//   outOfStock: number;
// };

// type Period = "Today" | "Weekly" | "Monthly";

// // --- CONSTANTS ---
// const LOW_STOCK_THRESHOLD = 10;
// const REFETCH_INTERVAL = 15000; // 15 seconds

// // --- COMPONENT ---
// export default function Dashboard() { // FIXED: Renamed from DashboardComponent to Dashboard
//   const { status } = useSession();

//   // State for Sales Data
//   const [salesData, setSalesData] = useState<SalesData>({
//     total: 0, cash: 0, qr: 0, bills: 0, lastUpdated: "",
//   });
//   const [activePeriod, setActivePeriod] = useState<Period>("Today");
//   const [isSalesLoading, setIsSalesLoading] = useState(true);
//   const [salesError, setSalesError] = useState<string | null>(null);

//   // State for Inventory Summary
//   const [inventorySummary, setInventorySummary] = useState<InventorySummary>({
//     inStock: 0, lowStock: 0, outOfStock: 0,
//   });
//   const [isSummaryLoading, setIsSummaryLoading] = useState(true);
//   const [summaryError, setSummaryError] = useState<string | null>(null);

//   // Effect to fetch sales data
//   useEffect(() => {
//     if (status !== 'authenticated') {
//       setIsSalesLoading(false);
//       return;
//     }

//     const fetchSales = async () => {
//       setIsSalesLoading(true);
//       setSalesError(null);
//       try {
//         const res = await fetch(`/api/sales?period=${activePeriod.toLowerCase()}`);
//         if (!res.ok) throw new Error("Failed to fetch sales data");
//         const data: SalesData = await res.json();
//         setSalesData(data);
//       } catch (err) {
//         console.error("Failed to load sales data:", err);
//         setSalesError("Could not load data.");
//       } finally {
//         setIsSalesLoading(false);
//       }
//     };

//     fetchSales();
//     const interval = setInterval(fetchSales, REFETCH_INTERVAL);
//     return () => clearInterval(interval);

//   }, [activePeriod, status]);

//   // Effect to fetch inventory summary
//   useEffect(() => {
//     if (status !== 'authenticated') {
//       setIsSummaryLoading(false);
//       return;
//     }

//     const fetchInventorySummary = async () => {
//         setIsSummaryLoading(true);
//         setSummaryError(null);
//         try {
//             const res = await fetch('/api/products');
//             if (!res.ok) throw new Error('Failed to fetch product data');
            
//             const products: Product[] = await res.json();
//             const summary: InventorySummary = products.reduce((acc, product) => {
//                 const threshold = product.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
//                 if (product.quantity === 0) {
//                     acc.outOfStock++;
//                 } else if (product.quantity <= threshold) {
//                     acc.lowStock++;
//                 } else {
//                     acc.inStock++;
//                 }
//                 return acc;
//             }, { inStock: 0, lowStock: 0, outOfStock: 0 });
//             setInventorySummary(summary);
//         } catch (err) {
//             console.error("Failed to load inventory summary:", err);
//             setSummaryError("Could not load data.");
//         } finally {
//             setIsSummaryLoading(false);
//         }
//     };

//     fetchInventorySummary();
//     const interval = setInterval(fetchInventorySummary, REFETCH_INTERVAL);
//     return () => clearInterval(interval);

//   }, [status]);

//   const TABS: Period[] = ["Today", "Weekly", "Monthly"];

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center lg:items-start lg:justify-center p-4 sm:p-6 pt-12 lg:pt-20 space-y-6 lg:space-y-0 lg:space-x-8">
      
//       {/* Sales Card */}
//       <div className="w-full max-w-sm lg:w-96 lg:max-w-md bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
//         <h3 className="text-lg font-bold text-gray-800 mb-4">
//           {activePeriod === 'Today' ? 'Today’s' : `This ${activePeriod.slice(0, -2)}'s`} Sales
//         </h3>
//         <div className="flex border-b border-gray-200 mb-4">
//           {TABS.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActivePeriod(tab)}
//               className={`py-2 px-4 text-sm font-medium focus:outline-none ${
//                 activePeriod === tab
//                   ? "border-b-2 border-blue-600 text-blue-600"
//                   : "text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {isSalesLoading ? (
//           <div className="text-center py-10 flex items-center justify-center text-gray-500 h-36">
//             <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Sales...
//           </div>
//         ) : salesError ? (
//           <div className="text-center py-10 flex items-center justify-center text-red-600 h-36">
//             <AlertTriangle className="w-5 h-5 mr-2" /> {salesError}
//           </div>
//         ) : (
//           <div className="h-36 flex flex-col justify-between">
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <p className="text-gray-600 text-sm">Total Sales</p>
//                 <p className="font-bold text-gray-900">₹{salesData.total}</p>
//               </div>
//               <div className="flex justify-between items-center">
//                 <p className="text-gray-600 text-sm">Cash</p>
//                 <p className="font-semibold text-green-600">₹{salesData.cash}</p>
//               </div>
//               <div className="flex justify-between items-center">
//                 <p className="text-gray-600 text-sm">QR / Online</p>
//                 <p className="font-semibold text-blue-600">₹{salesData.qr}</p>
//               </div>
//             </div>
//             <div className="flex justify-between border-t pt-4 text-sm text-gray-500">
//               <span>Bills: {salesData.bills}</span>
//               <span>{salesData.lastUpdated}</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Inventory Summary Card */}
//       <div className="w-full max-w-sm lg:w-96 lg:max-w-md bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
//         <h3 className="text-lg font-bold text-gray-800 mb-4">
//           Inventory Summary
//         </h3>
//         {isSummaryLoading ? (
//            <div className="text-center py-10 flex items-center justify-center text-gray-500 h-44">
//              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Summary...
//            </div>
//         ) : summaryError ? (
//           <div className="text-center py-10 flex items-center justify-center text-red-600 h-44">
//             <AlertTriangle className="w-5 h-5 mr-2" /> {summaryError}
//           </div>
//         ) : (
//           <div className="space-y-4 h-44">
//               <div className="flex items-center justify-between text-green-700 bg-green-50 p-3 rounded-lg">
//                   <div className="flex items-center gap-3">
//                       <Package className="w-5 h-5" />
//                       <span className="font-medium text-sm">In Stock</span>
//                   </div>
//                   <span className="font-bold text-base">{inventorySummary.inStock}</span>
//               </div>
//               <div className="flex items-center justify-between text-orange-700 bg-orange-50 p-3 rounded-lg">
//                   <div className="flex items-center gap-3">
//                       <AlertTriangle className="w-5 h-5" />
//                       <span className="font-medium text-sm">Low Stock</span>
//                   </div>
//                   <span className="font-bold text-base">{inventorySummary.lowStock}</span>
//               </div>
//               <div className="flex items-center justify-between text-red-700 bg-red-50 p-3 rounded-lg">
//                   <div className="flex items-center gap-3">
//                       <XCircle className="w-5 h-5" />
//                       <span className="font-medium text-sm">Out of Stock</span>
//                   </div>
//                   <span className="font-bold text-base">{inventorySummary.outOfStock}</span>
//               </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// src/components/Dashboard.tsx

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Package, AlertTriangle, XCircle, Loader2, TrendingUp, Wallet, CreditCard } from "lucide-react";

// --- TYPE DEFINITIONS ---
type SalesData = {
  total: number;
  cash: number;
  qr: number;
  bills: number;
  lastUpdated: string;
};

interface Product {
  id: string;
  name: string;
  quantity: number;
  lowStockThreshold?: number;
}

type InventorySummary = {
  inStock: number;
  lowStock: number;
  outOfStock: number;
};

type Period = "Today" | "Weekly" | "Monthly";

// --- CONSTANTS ---
const LOW_STOCK_THRESHOLD = 10;
const REFETCH_INTERVAL = 15000; // 15 seconds

// --- COMPONENT ---
export default function Dashboard() {
  const { status } = useSession();

  // State for Sales Data
  const [salesData, setSalesData] = useState<SalesData>({
    total: 0, cash: 0, qr: 0, bills: 0, lastUpdated: "",
  });
  const [activePeriod, setActivePeriod] = useState<Period>("Today");
  const [isSalesLoading, setIsSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState<string | null>(null);

  // State for Inventory Summary
  const [inventorySummary, setInventorySummary] = useState<InventorySummary>({
    inStock: 0, lowStock: 0, outOfStock: 0,
  });
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Effect to fetch sales data
  useEffect(() => {
    if (status !== 'authenticated') {
      setIsSalesLoading(false);
      return;
    }

    const fetchSales = async () => {
      setIsSalesLoading(true);
      setSalesError(null);
      try {
        const res = await fetch(`/api/sales?period=${activePeriod.toLowerCase()}`);
        if (!res.ok) throw new Error("Failed to fetch sales data");
        const data: SalesData = await res.json();
        setSalesData(data);
      } catch (err) {
        console.error("Failed to load sales data:", err);
        setSalesError("Could not load data.");
      } finally {
        setIsSalesLoading(false);
      }
    };

    fetchSales();
    const interval = setInterval(fetchSales, REFETCH_INTERVAL);
    return () => clearInterval(interval);

  }, [activePeriod, status]);

  // Effect to fetch inventory summary
  useEffect(() => {
    if (status !== 'authenticated') {
      setIsSummaryLoading(false);
      return;
    }

    const fetchInventorySummary = async () => {
        setIsSummaryLoading(true);
        setSummaryError(null);
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error('Failed to fetch product data');
            
            const products: Product[] = await res.json();
            const summary: InventorySummary = products.reduce((acc, product) => {
                const threshold = product.lowStockThreshold ?? LOW_STOCK_THRESHOLD;
                if (product.quantity === 0) {
                    acc.outOfStock++;
                } else if (product.quantity <= threshold) {
                    acc.lowStock++;
                } else {
                    acc.inStock++;
                }
                return acc;
            }, { inStock: 0, lowStock: 0, outOfStock: 0 });
            setInventorySummary(summary);
        } catch (err) {
            console.error("Failed to load inventory summary:", err);
            setSummaryError("Could not load data.");
        } finally {
            setIsSummaryLoading(false);
        }
    };

    fetchInventorySummary();
    const interval = setInterval(fetchInventorySummary, REFETCH_INTERVAL);
    return () => clearInterval(interval);

  }, [status]);

  const TABS: Period[] = ["Today", "Weekly", "Monthly"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor your business performance</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sales Card - Left */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#5a4fcf] rounded-xl flex items-center justify-center shadow-lg shadow-[#5a4fcf]/20">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Sales Overview</h3>
                  <p className="text-sm text-gray-500">
                    {activePeriod === 'Today' ? "Today's" : `This ${activePeriod.slice(0, -2)}'s`} performance
                  </p>
                </div>
              </div>
            </div>

            {/* Period Tabs */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePeriod(tab)}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activePeriod === tab
                      ? "bg-[#5a4fcf] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {isSalesLoading ? (
              <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#5a4fcf]" /> 
                <span className="text-sm">Loading sales data...</span>
              </div>
            ) : salesError ? (
              <div className="text-center py-12 flex flex-col items-center justify-center text-red-500">
                <AlertTriangle className="w-8 h-8 mb-3" /> 
                <span className="text-sm">{salesError}</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Total Sales - Featured */}
                <div className="bg-gradient-to-br from-[#5a4fcf] to-[#7c6fdd] rounded-xl p-5 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Total Sales</p>
                      <p className="text-4xl font-bold">₹{salesData.total.toLocaleString()}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  </div>
                </div>
                
                {/* Payment Methods Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-semibold text-green-700">Cash Payment</p>
                    </div>
                    <p className="text-2xl font-bold text-green-800">₹{salesData.cash.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <p className="text-xs font-semibold text-blue-700">QR / Online</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">₹{salesData.qr.toLocaleString()}</p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#5a4fcf] rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{salesData.bills} Total Bills</span>
                  </div>
                  <span className="text-xs text-gray-500">{salesData.lastUpdated}</span>
                </div>
              </div>
            )}
          </div>

          {/* Inventory Card - Right */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#5a4fcf] rounded-xl flex items-center justify-center shadow-lg shadow-[#5a4fcf]/20">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Inventory Status</h3>
                <p className="text-sm text-gray-500">Current stock levels</p>
              </div>
            </div>

            {isSummaryLoading ? (
              <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#5a4fcf]" /> 
                <span className="text-sm">Loading inventory...</span>
              </div>
            ) : summaryError ? (
              <div className="text-center py-12 flex flex-col items-center justify-center text-red-500">
                <AlertTriangle className="w-8 h-8 mb-3" /> 
                <span className="text-sm">{summaryError}</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* In Stock */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Package className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-700 mb-1">In Stock</p>
                        <p className="text-3xl font-bold text-green-800">{inventorySummary.inStock}</p>
                      </div>
                    </div>
                    <div className="text-green-600">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Low Stock */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border-2 border-orange-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-orange-700 mb-1">Low Stock</p>
                        <p className="text-3xl font-bold text-orange-800">{inventorySummary.lowStock}</p>
                      </div>
                    </div>
                    <div className="text-orange-600">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Out of Stock */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-2 border-red-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <XCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-700 mb-1">Out of Stock</p>
                        <p className="text-3xl font-bold text-red-800">{inventorySummary.outOfStock}</p>
                      </div>
                    </div>
                    <div className="text-red-600">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}