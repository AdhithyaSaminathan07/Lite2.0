// 'use client';

// import React, { useEffect, useState } from 'react';

// // Define an interface for the Bill object
// interface Bill {
//   createdAt: string; // Or Date, depending on what your API returns
//   amount: number;
//   paymentMethod: string;
// }

// export default function BillingHistory() {
//   // Use the Bill interface instead of any[]
//   const [bills, setBills] = useState<Bill[]>([]);
//   const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await fetch('/api/billing-history');
//         const data = await res.json();
//         setBills(data);
//         setFilteredBills(data);
//       } catch (error) {
//         console.error('Error fetching billing history:', error);
//       }
//     };
//     fetchHistory();
//   }, []);

//   const handleFilter = () => {
//     if (!fromDate && !toDate) {
//       setFilteredBills(bills);
//       return;
//     }

//     const from = fromDate ? new Date(fromDate) : new Date('2000-01-01');
//     const to = toDate ? new Date(toDate) : new Date();
//     to.setHours(23, 59, 59, 999);

//     const filtered = bills.filter((bill) => {
//       const createdAt = new Date(bill.createdAt);
//       return createdAt >= from && createdAt <= to;
//     });

//     setFilteredBills(filtered);
//   };

//   const clearFilter = () => {
//     setFromDate('');
//     setToDate('');
//     setFilteredBills(bills);
//   };

//   return (
//     <div className="relative min-h-screen bg-gray-50">
//       <div className="sticky top-0 z-10 bg-gray-50 p-3 sm:p-4 border-b shadow-sm">
//         <h1 className="text-lg sm:text-2xl font-semibold mb-2 text-gray-800">
//           Billing History
//         </h1>

//         {/* Sticky Compact Filter Section */}
//         <div className="flex flex-wrap items-end gap-1 bg-white p-2 rounded-md shadow-sm border text-xs">
//           <div className="flex flex-col">
//             <label className="text-[10px] text-gray-600 mb-[2px]">From</label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="border rounded-md px-1.5 py-[3px] text-[11px] w-28 sm:w-32 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
//             />
//           </div>
//           <div className="flex flex-col">
//             <label className="text-[10px] text-gray-600 mb-[2px]">To</label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="border rounded-md px-1.5 py-[3px] text-[11px] w-28 sm:w-32 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
//             />
//           </div>

//           <button
//             onClick={handleFilter}
//             className="bg-indigo-600 text-white px-2 py-[5px] rounded-md text-[11px] font-medium hover:bg-indigo-700 transition"
//           >
//             Filter
//           </button>

//           <button
//             onClick={clearFilter}
//             className="bg-gray-200 text-gray-700 px-2 py-[5px] rounded-md text-[11px] font-medium hover:bg-gray-300 transition"
//           >
//             Clear
//           </button>
//         </div>
//       </div>

//       {/* Scrollable Billing Table */}
//       <div className="p-3 sm:p-5">
//         {filteredBills.length === 0 ? (
//           <div className="p-4 bg-white border rounded-lg text-center text-gray-500 shadow-sm text-sm">
//             No billing records found for the selected period.
//           </div>
//         ) : (
//           <div className="overflow-x-auto bg-white border rounded-lg shadow-md">
//             <table className="min-w-full text-[13px] sm:text-sm text-gray-700">
//               <thead className="bg-indigo-50 text-indigo-700 font-semibold">
//                 <tr>
//                   <th className="px-3 py-1.5 text-left">Date / Time</th>
//                   <th className="px-3 py-1.5 text-right">Amount (₹)</th>
//                   <th className="px-3 py-1.5 text-left">Payment Method</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredBills.map((bill, index) => {
//                   const formattedDate = new Date(bill.createdAt).toLocaleString();
//                   return (
//                     <tr
//                       key={index}
//                       className="border-t hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-3 py-1.5">{formattedDate}</td>
//                       <td className="px-3 py-1.5 text-right font-medium text-gray-900">
//                         ₹{bill.amount}
//                       </td>
//                       <td className="px-3 py-1.5 capitalize">{bill.paymentMethod}</td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// 'use client';

// import React, { useEffect, useState } from 'react';

// export default function BillingHistory() {
//   const [bills, setBills] = useState([]);
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');

//   // Helper to get today's date in YYYY-MM-DD format
//   const getToday = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   // Fetch today’s bills on load
//   useEffect(() => {
//     const today = getToday();
//     setFromDate(today);
//     setToDate(today);
//     fetchHistory(today, today);
//   }, []);

//   const fetchHistory = async (from: string, to: string) => {
//     try {
//       const res = await fetch(`/api/billing-history?from=${from}&to=${to}`);
//       const data = await res.json();
//       setBills(data);
//     } catch (error) {
//       console.error('Error fetching billing history:', error);
//     }
//   };

//   const handleFilter = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchHistory(fromDate, toDate);
//   };

//   return (
//     <div className="p-4 min-h-screen bg-gray-50">
//       <h1 className="text-xl font-semibold mb-4 text-gray-800">Billing History</h1>

//       {/* Date Filter Section */}
//       <form
//         onSubmit={handleFilter}
//         className="flex items-center gap-2 mb-4 bg-white p-2 rounded-lg shadow-sm border w-fit"
//       >
//         <div className="flex items-center gap-1">
//           <label className="text-sm text-gray-700">From:</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="border rounded-md px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex items-center gap-1">
//           <label className="text-sm text-gray-700">To:</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border rounded-md px-2 py-1 text-sm"
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-indigo-700 transition"
//         >
//           Filter
//         </button>
//       </form>

//       {/* Billing Table */}
//       {bills.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-white rounded-xl shadow-sm border">
//           <p>No billing records found for this period.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
//           <table className="min-w-full text-sm text-gray-700">
//             <thead className="bg-indigo-50 text-indigo-700 text-left font-semibold">
//               <tr>
//                 <th className="px-4 py-3">Date / Time</th>
//                 <th className="px-4 py-3 text-right">Amount</th>
//                 <th className="px-4 py-3">Payment Method</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bills.map((bill: any, index) => (
//                 <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-2">
//                     {new Date(bill.createdAt).toLocaleString()}
//                   </td>
//                   <td className="px-4 py-2 text-right font-medium text-gray-900">
//                     ₹{bill.amount}
//                   </td>
//                   <td className="px-4 py-2 capitalize">{bill.paymentMethod}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import React, { useEffect, useState } from 'react';

// Define an interface for the structure of a single bill object
interface Bill {
  createdAt: string; // The raw date string from the API
  amount: number;
  paymentMethod: string;
}

export default function BillingHistory() {
  // Use the Bill interface to strongly type the state
  const [bills, setBills] = useState<Bill[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Helper to get today's date in YYYY-MM-DD format
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch today’s bills on component load
  useEffect(() => {
    const today = getToday();
    setFromDate(today);
    setToDate(today);
    fetchHistory(today, today);
  }, []);

  const fetchHistory = async (from: string, to: string) => {
    try {
      const res = await fetch(`/api/billing-history?from=${from}&to=${to}`);
      if (!res.ok) {
        throw new Error('Failed to fetch billing history');
      }
      const data = await res.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching billing history:', error);
      // Optionally, set bills to an empty array in case of an error
      setBills([]);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(fromDate, toDate);
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Billing History</h1>

      {/* Date Filter Section */}
      <form
        onSubmit={handleFilter}
        className="flex items-center gap-2 mb-4 bg-white p-2 rounded-lg shadow-sm border w-fit"
      >
        <div className="flex items-center gap-1">
          <label htmlFor="fromDate" className="text-sm text-gray-700">From:</label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="toDate" className="text-sm text-gray-700">To:</label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-indigo-700 transition"
        >
          Filter
        </button>
      </form>

      {/* Billing Table */}
      {bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-white rounded-xl shadow-sm border">
          <p>No billing records found for this period.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-indigo-50 text-indigo-700 text-left font-semibold">
              <tr>
                <th className="px-4 py-3">Date / Time</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">
                    {new Date(bill.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right font-medium text-gray-900">
                    ₹{bill.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 capitalize">{bill.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}