// src/app/page.tsx

import Link from "next/link";
import Header from "@/components/layout/Header"; // Correctly imports the Header component

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Header is included here */}
      <Header />
      
      {/* Main Content Centered */}
      <main className="flex flex-col items-center justify-center flex-grow p-4 sm:p-8">
        
        {/* Home Page Card/Box */}
        <div className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 text-center max-w-lg w-full transform transition duration-500 hover:scale-[1.02]">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Welcome to <span className="text-blue-600">Billzzy Lite</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Smart Billing Made Easy <span className="text-2xl">🚀</span>
          </p>
          <p className="mt-2 text-md text-gray-400">
            Get started in seconds with the fastest way to manage your invoices.
          </p>

          {/* Action Buttons (Responsive Layout) */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            
            <Link 
              href="/auth?mode=login" // Direct to login mode
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Log In Now
            </Link>
            
            <Link 
              href="/auth?mode=register" // Direct to register mode
              className="w-full sm:w-auto px-8 py-3 bg-white text-blue-600 font-semibold border-2 border-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Create an Account
            </Link>

          </div>
          
        </div>
      </main>
    </div>
  );
}