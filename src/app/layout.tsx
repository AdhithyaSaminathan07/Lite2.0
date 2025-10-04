// // import Header from "@/components/Header";
// // // import InvoiceCard from "@/components/InvoiceCard";

// // export default function Home() {
// //   return (
// //     <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
// //       <Header />
      
// //     </main>
// //   );
// // }

// // import './styles/globals.css';
// import { ReactNode } from 'react';

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//   <title>Billzzy Lite</title>
//   <meta name="description" content="A lightweight billing PWA" />
//   <link rel="manifest" href="/manifest.json" />
//   <meta name="theme-color" content="#0ea5e9" />
//   <meta name="mobile-web-app-capable" content="yes" />
//   <meta name="apple-mobile-web-app-capable" content="yes" />
//   <meta name="apple-mobile-web-app-status-bar-style" content="default" />
//   <link rel="apple-touch-icon" href="/icons/icon-192.png" />
// </head>
//       <body>{children}</body>
//     </html>
//   );
// }


import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Billzzy Lite',
  description: 'Effortless Payments',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6B4EFF" />
      </head>
      <body className={poppins.className}>
        <main className="container mx-auto max-w-md px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}