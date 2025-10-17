
// "use client";

// import { useState, useEffect } from "react";
// import { Package, AlertTriangle, XCircle, Loader2 } from "lucide-react";

// // --- TYPE DEFINITIONS ---

// // For Sales Data
// type SalesData = {
//   total: number;
//   cash: number;
//   qr: number;
//   bills: number;
//   lastUpdated: string;
// };

// // For Product Data (to calculate summary)
// interface Product {
//   id: string;
//   name: string;
//   quantity: number;
//   lowStockThreshold?: number;
// }

// // For the calculated Inventory Summary
// type InventorySummary = {
//   inStock: number;
//   lowStock: number;
//   outOfStock: number;
// };

// // Possible time periods for the sales tabs
// type Period = "Today" | "Weekly" | "Monthly";

// // --- CONSTANTS ---
// const LOW_STOCK_THRESHOLD = 10; // Global fallback


// // --- COMPONENT ---

// export default function DashboardComponent() {
//   // State for Sales Data
//   const [salesData, setSalesData] = useState<SalesData>({
//     total: 0, cash: 0, qr: 0, bills: 0, lastUpdated: "",
//   });
//   const [activePeriod, setActivePeriod] = useState<Period>("Today");
//   const [isSalesLoading, setIsSalesLoading] = useState(true);

//   // State for Inventory Summary
//   const [inventorySummary, setInventorySummary] = useState<InventorySummary>({
//     inStock: 0, lowStock: 0, outOfStock: 0,
//   });
//   const [isSummaryLoading, setIsSummaryLoading] = useState(true);


//   // Effect to fetch sales data based on the active period
//   useEffect(() => {
//     const fetchSales = async () => {
//       setIsSalesLoading(true);
//       try {
//         const res = await fetch(`/api/sales?period=${activePeriod.toLowerCase()}`);
//         if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
//         const data: SalesData = await res.json();
//         setSalesData(data);
//       } catch (err) {
//         console.error("Failed to load sales data:", err);
//       } finally {
//         setIsSalesLoading(false);
//       }
//     };

//     fetchSales();
//     const interval = setInterval(fetchSales, 15000); // Auto-refresh sales
//     return () => clearInterval(interval);
//   }, [activePeriod]);


//   // Effect to fetch product data for the inventory summary, with live updates
//   useEffect(() => {
//     setIsSummaryLoading(true);
    
//     const fetchInventorySummary = async () => {
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
//         } finally {
//             if (isSummaryLoading) {
//               setIsSummaryLoading(false);
//             }
//         }
//     };

//     fetchInventorySummary();
//     const interval = setInterval(fetchInventorySummary, 15000);
//     return () => clearInterval(interval);
//   }, []);


//   const TABS: Period[] = ["Today", "Weekly", "Monthly"];

//   return (
//     // RESPONSIVE CONTAINER:
//     // - Stacks vertically on mobile (flex-col)
//     // - Becomes a row on large screens (lg:flex-row) with a gap (lg:space-x-8)
//     <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center lg:items-start lg:justify-center p-4 sm:p-6 pt-12 lg:pt-20 space-y-6 lg:space-y-0 lg:space-x-8">
      
//       {/* Sales Card - Added responsive width */}
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

//       {/* Inventory Summary Card - Added responsive width */}
//       <div className="w-full max-w-sm lg:w-96 lg:max-w-md bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
//         <h3 className="text-lg font-bold text-gray-800 mb-4">
//           Inventory Summary
//         </h3>
//         {isSummaryLoading ? (
//            <div className="text-center py-10 flex items-center justify-center text-gray-500 h-44">
//              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Summary...
//            </div>
//         ) : (
//         <div className="space-y-4 h-44">
//             <div className="flex items-center justify-between text-green-700 bg-green-50 p-3 rounded-lg">
//                 <div className="flex items-center gap-3">
//                     <Package className="w-5 h-5" />
//                     <span className="font-medium text-sm">In Stock</span>
//                 </div>
//                 <span className="font-bold text-base">{inventorySummary.inStock}</span>
//             </div>
//             <div className="flex items-center justify-between text-orange-700 bg-orange-50 p-3 rounded-lg">
//                 <div className="flex items-center gap-3">
//                     <AlertTriangle className="w-5 h-5" />
//                     <span className="font-medium text-sm">Low Stock</span>
//                 </div>
//                 <span className="font-bold text-base">{inventorySummary.lowStock}</span>
//             </div>
//             <div className="flex items-center justify-between text-red-700 bg-red-50 p-3 rounded-lg">
//                 <div className="flex items-center gap-3">
//                     <XCircle className="w-5 h-5" />
//                     <span className="font-medium text-sm">Out of Stock</span>
//                 </div>
//                 <span className="font-bold text-base">{inventorySummary.outOfStock}</span>
//             </div>
//         </div>
//         )}
//       </div>

//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Package, AlertTriangle, XCircle, Loader2 } from "lucide-react";

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

// --- COMPONENT ---
export default function DashboardComponent() {
  const { data: session, status } = useSession();

  // State for Sales Data
  const [salesData, setSalesData] = useState<SalesData>({
    total: 0, cash: 0, qr: 0, bills: 0, lastUpdated: "",
  });
  const [activePeriod, setActivePeriod] = useState<Period>("Today");
  const [isSalesLoading, setIsSalesLoading] = useState(true);

  // State for Inventory Summary
  const [inventorySummary, setInventorySummary] = useState<InventorySummary>({
    inStock: 0, lowStock: 0, outOfStock: 0,
  });
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  // FIXED: Effect to fetch sales data now depends on auth status.
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchSales = async () => {
        setIsSalesLoading(true);
        try {
          const res = await fetch(`/api/sales?period=${activePeriod.toLowerCase()}`);
          if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
          const data: SalesData = await res.json();
          setSalesData(data);
        } catch (err) {
          console.error("Failed to load sales data:", err);
        } finally {
          setIsSalesLoading(false);
        }
      };

      fetchSales();
      const interval = setInterval(fetchSales, 15000);
      return () => clearInterval(interval);
    } else if (status === 'unauthenticated') {
        setIsSalesLoading(false);
    }
  }, [activePeriod, status]);

  // FIXED: Effect to fetch inventory summary now depends on auth status.
  useEffect(() => {
    if (status === 'authenticated') {
      setIsSummaryLoading(true);
      const fetchInventorySummary = async () => {
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
          } finally {
              if (isSummaryLoading) {
                setIsSummaryLoading(false);
              }
          }
      };

      fetchInventorySummary();
      const interval = setInterval(fetchInventorySummary, 15000);
      return () => clearInterval(interval);
    } else if (status === 'unauthenticated') {
        setIsSummaryLoading(false);
    }
  }, [status]);

  const TABS: Period[] = ["Today", "Weekly", "Monthly"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row items-center lg:items-start lg:justify-center p-4 sm:p-6 pt-12 lg:pt-20 space-y-6 lg:space-y-0 lg:space-x-8">
      
      {/* Sales Card */}
      <div className="w-full max-w-sm lg:w-96 lg:max-w-md bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          {activePeriod === 'Today' ? 'Today’s' : `This ${activePeriod.slice(0, -2)}'s`} Sales
        </h3>
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

        {isSalesLoading ? (
          <div className="text-center py-10 flex items-center justify-center text-gray-500 h-36">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Sales...
          </div>
        ) : (
          <div className="h-36 flex flex-col justify-between">
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
            <div className="flex justify-between border-t pt-4 text-sm text-gray-500">
              <span>Bills: {salesData.bills}</span>
              <span>{salesData.lastUpdated}</span>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Summary Card */}
      <div className="w-full max-w-sm lg:w-96 lg:max-w-md bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Inventory Summary
        </h3>
        {isSummaryLoading ? (
           <div className="text-center py-10 flex items-center justify-center text-gray-500 h-44">
             <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading Summary...
           </div>
        ) : (
        <div className="space-y-4 h-44">
            <div className="flex items-center justify-between text-green-700 bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span className="font-medium text-sm">In Stock</span>
                </div>
                <span className="font-bold text-base">{inventorySummary.inStock}</span>
            </div>
            <div className="flex items-center justify-between text-orange-700 bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium text-sm">Low Stock</span>
                </div>
                <span className="font-bold text-base">{inventorySummary.lowStock}</span>
            </div>
            <div className="flex items-center justify-between text-red-700 bg-red-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Out of Stock</span>
                </div>
                <span className="font-bold text-base">{inventorySummary.outOfStock}</span>
            </div>
        </div>
        )}
      </div>

    </div>
  );
}