

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Ensure code only runs in the browser
    if (typeof window !== "undefined" && window.localStorage) {
      const authStatus = window.localStorage.getItem("isAuthenticated");

      if (authStatus) {
        setIsAuthenticated(true);
      } else {
        router.push("/auth");
      }
    }
  }, [router]);

  // Show loading while checking auth
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Dashboard content
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome to Your Dashboard!
        </h2>
      </div>
    </div>
  );
}
