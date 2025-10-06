// src/app/inventory/page.tsx (Example)

import React from 'react';
import Header from "@/components/layout/Header";

export default function InventoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Inventory Management</h1>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-gray-700">List of items and forms to manage inventory.</p>
        </div>
      </main>
    </div>
  );
}
