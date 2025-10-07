
import { LoginForm } from '@/components/forms/loginform'; // Adjust the import path if needed
import Link from 'next/link';

// This is the default export that Next.js will render for the /login route
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Sign In to Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
              create a new account
            </Link>
          </p>
        </div>

        {/* The Login Form Component */}
        <LoginForm />

      </div>
    </div>
  );
}