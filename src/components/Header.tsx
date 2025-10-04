import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto flex justify-center">
        <Link href="/">
          <Image
            src="/billzzy-logo.svg" // Place your logo in the /public folder
            alt="Billzzy Lite Logo"
            width={150}
            height={40}
            priority
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;