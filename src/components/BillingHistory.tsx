'use client';

import React, { useEffect, useState } from 'react';

interface Bill {
  createdAt: string;
  amount: number;
  paymentMethod: string;
}

export default function BillingHistory() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const today = getToday();
    setFromDate(today);
    setToDate(today);
    fetchHistory(today, today);
  }, []);

  const fetchHistory = async (from: string, to: string) => {
    try {
      const res = await fetch(`/api/billing-history?from=${from}&to=${to}`);
      if (!res.ok) throw new Error('Failed to fetch billing history');
      const data = await res.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching billing history:', error);
      setBills([]);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(fromDate, toDate);
  };

  const handleClear = () => {
    const today = getToday();
    setFromDate(today);
    setToDate(today);
    fetchHistory(today, today);
  };

  return (
    <div className="p-3 sm:p-4 min-h-screen bg-gray-50">
      {/* <h1 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800 text-center sm:text-left">
        Billing History
      </h1> */}

      {/* Compact Date Filter Section */}
      <form
        onSubmit={handleFilter}
        className="flex flex-wrap items-center gap-2 mb-4 bg-white p-2 sm:p-3 rounded-md shadow-sm border w-full sm:w-auto text-xs sm:text-sm"
      >
        <div className="flex items-center gap-1">
          <label htmlFor="fromDate" className="text-gray-700">
            From:
          </label>
          <input
            id="fromDate"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-md px-1.5 py-0.5 text-xs sm:text-sm w-28 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="toDate" className="text-gray-700">
            To:
          </label>
          <input
            id="toDate"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-md px-1.5 py-0.5 text-xs sm:text-sm w-28 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-1 sm:gap-2 mt-1 sm:mt-0">
          <button
            type="submit"
            className="bg-indigo-600 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md hover:bg-indigo-700 transition"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-md hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Billing Table */}
      {bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500 bg-white rounded-md shadow-sm border text-sm">
          <p>No billing records found for this period.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 shadow-sm bg-white">
          <table className="min-w-full text-xs sm:text-sm text-gray-700">
            <thead className="bg-indigo-50 text-indigo-700 font-semibold">
              <tr>
                <th className="px-3 py-2 text-left">Date / Time</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-left">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(bill.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-900">
                    ₹{bill.amount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 capitalize">{bill.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
