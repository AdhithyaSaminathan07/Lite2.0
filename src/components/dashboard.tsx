 
// In: src/components/dashboard.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  // 1. Use the official 'useSession' hook to get session data and status
  const { data: session, status } = useSession();
  const router = useRouter();

  // 2. This useEffect now correctly checks the session 'status'
  useEffect(() => {
    
    if (status === "unauthenticated") {
      router.push("/"); // Redirect to your main login page
    }
  }, [status, router]);

  // 3. Show a loading state while the session is being verified
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 4. Only render the dashboard content if the user is authenticated
  if (status === "authenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to Your Dashboard, {session.user?.name}!
          </h2>
          <p className="mt-2 text-gray-700">
            Your email is: {session.user?.email}
          </p>

          {/* <button
            onClick={() => signOut({ callbackUrl: '/' })} // Sign out and return to the login page
            className="mt-8 px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"
          >
            Sign Out
          </button> */}
        </div>
      </div>
    );
  }

  // If status is 'unauthenticated', the redirect is happening, so we return null.
  return null;
}
