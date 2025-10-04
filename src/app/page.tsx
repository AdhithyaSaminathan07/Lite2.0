import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-primary">Welcome to Billzzy Lite</h1>
      <p className="mt-2 text-gray-600">Smart Billing Made Easy 🚀</p>

      <div className="mt-6 flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-primary text-white rounded-md">
          Login
        </Link>
        <Link href="/sign-up" className="px-4 py-2 bg-secondary text-white rounded-md">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
