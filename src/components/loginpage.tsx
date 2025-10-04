import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center text-center min-h-screen">
      <Header />
      <div className="my-8">
        <Image
            src="/welcome-mascot.png" // Place this image in /public
            alt="Welcome Mascot"
            width={180}
            height={180}
        />
      </div>
      <h2 className="text-3xl font-bold text-dark-text mb-8">HEY THERE !</h2>

      <form className="w-full max-w-sm">
        <div className="mb-4">
          <input
            type="email"
            placeholder="EMAIL"
            className="w-full p-4 rounded-large bg-input-bg border-none placeholder-light-text"
          />
        </div>
        <div className="mb-8">
          <input
            type="password"
            placeholder="PASSWORD"
            className="w-full p-4 rounded-large bg-input-bg border-none placeholder-light-text"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-purple to-secondary-purple text-white font-bold py-4 rounded-large"
        >
          Log In
        </button>
      </form>

      <p className="mt-8 text-light-text">
        Create a new account?{' '}
        <Link href="/signup" className="text-primary-purple font-bold">
          SIGN UP
        </Link>
      </p>
    </div>
  );
}