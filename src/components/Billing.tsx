// // src/components/Billing.tsx

'use client';

import { useState } from 'react';

// You can replace these with your actual icons
const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// Mock data - replace with your actual data fetching
const subscription = {
  plan: 'Pro',
  price: 99,
  nextInvoice: 'October 23, 2025',
};

const paymentMethod = {
  brand: 'Visa',
  last4: '4242',
  expires: '10/26',
};

const billingHistory = [
  { id: 1, date: 'September 23, 2025', amount: 99.00, invoiceUrl: '#' },
  { id: 2, date: 'August 23, 2025', amount: 99.00, invoiceUrl: '#' },
  { id: 3, date: 'July 23, 2025', amount: 99.00, invoiceUrl: '#' },
];

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Subscription and Payment */}
        <div className="md:col-span-2 space-y-8">
          {/* Current Subscription */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Current Subscription</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-lg">{subscription.plan} Plan</p>
                <p className="text-gray-600">Next invoice on {subscription.nextInvoice}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${subscription.price}<span className="text-base font-normal text-gray-500">/mo</span></p>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Change Plan
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <div className="flex items-center">
              <CreditCardIcon />
              <div>
                <p className="font-medium">{paymentMethod.brand} ending in {paymentMethod.last4}</p>
                <p className="text-gray-600">Expires {paymentMethod.expires}</p>
              </div>
            </div>
             <div className="mt-6">
              <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                Update Payment Method
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Billing History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Billing History</h2>
          <ul className="space-y-4">
            {billingHistory.map((invoice) => (
              <li key={invoice.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-gray-600">Amount: ${invoice.amount.toFixed(2)}</p>
                </div>
                <a href={invoice.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-gray-100">
                  <DownloadIcon />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}