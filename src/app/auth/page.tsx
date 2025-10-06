// src/app/auth/page.tsx

'use client'; 
import { useSearchParams } from 'next/navigation'; 
import Link from "next/link";
import LoginForm from "@/components/forms/LoginForm";
import SignUpForm from "@/components/forms/SignUpForm";

export default function AuthPage() {
  // Determine if we should show 'register' based on the URL parameter
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  
  const isRegisterMode = mode === 'register';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      
      {/* Auth Card Container */}
      <div 
        className="bg-white shadow-2xl rounded-xl w-full max-w-sm p-8 sm:p-10 border border-gray-100 transform transition duration-500 hover:scale-[1.01]"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2"> 
            {isRegisterMode ? 'Create Account' : 'Sign In'}
          </h1>
          <p className="text-sm text-gray-600"> 
            {isRegisterMode ? 'Start your journey with Billzzy Lite.' : 'Access your dashboard.'}
          </p>
        </div>

        {/* Dynamic Form Render */}
        {isRegisterMode ? <SignUpForm /> : <LoginForm />}

        {/* Footer/Navigation Link */}
        <div className="mt-8 text-center text-sm space-y-3"> 
          
          {isRegisterMode ? (
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth?mode=login" className="text-indigo-600 font-semibold hover:underline">
                Log In
              </Link>
            </p>
          ) : (
            <>
              <Link 
                href="/auth?mode=forgot" 
                className="text-indigo-600 font-medium hover:underline block"
              >
                Forgot your password?
              </Link>
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth?mode=register" className="text-indigo-600 font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}