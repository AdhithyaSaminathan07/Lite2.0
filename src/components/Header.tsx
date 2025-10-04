// import Image from 'next/image';
// import Link from 'next/link';

// const Header = () => {
//   return (
//     <header className="py-6">
//       <div className="container mx-auto flex justify-center">
//         <Link href="/">
//           <Image
//             src="/billzzy-logo.svg" // Place your logo in the /public folder
//             alt="Billzzy Lite Logo"
//             width={150}
//             height={40}
//             priority
//           />
//         </Link>
//       </div>
//     </header>
//   );
// };

// export default Header;


import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-card shadow-sm">
      <Link href="/" className="text-xl font-bold text-primary">Billzzy Lite</Link>
      <nav className="space-x-4">
        <Link href="/login" className="text-foreground hover:text-primary">Login</Link>
        <Link href="/sign-up" className="text-foreground hover:text-primary">Sign Up</Link>
        <Link href="/dashboard" className="text-foreground hover:text-primary">Dashboard</Link>
      </nav>
    </header>
  );
}
