


import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center h-screen">
      <Header />
      <h1 className="text-3xl font-bold text-dark-text mt-8 leading-tight">
        Step Into Tomorrow,
        <br />
        Where Payments
        <br />
        Think Faster..
      </h1>

      <div className="my-6">
        <Image
          src="/hero-image.png" // Place this image in your /public folder
          alt="Payment Partner"
          width={320}
          height={320}
          priority
        />
      </div>

      <p className="max-w-xs text-light-text mb-8">
        Billzzy is Your Pocket-Ready Payment Partner. Tap, Scan And Pay Faster Than Ever. No Friction. No Waiting. No Limits. Just Effortless Transactions.
      </p>

      <Link
        href="/signup"
        className="w-full max-w-xs bg-gradient-to-r from-primary-purple to-secondary-purple text-white font-bold py-4 px-6 rounded-large shadow-lg"
      >
        Get Started &gt;&gt;
      </Link>
    </div>
  );
}