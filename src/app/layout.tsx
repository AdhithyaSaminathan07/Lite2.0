import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
  <title>Billzzy Lite</title>
  <meta name="description" content="A lightweight billing PWA" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#0ea5e9" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
</head>
      <body>{children}

      </body>
    </html>
  );
}


// // app/layout.tsx
// import type { Metadata } from "next";
// import "./globals.css"; // ensure this file exists in app/

// export const metadata: Metadata = {
//   title: "Billzzy Lite",
//   description: "A lightweight billing PWA",
//   themeColor: "#0ea5e9",
//   manifest: "/manifest.json",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
//         <link rel="apple-touch-icon" href="/icons/icon-192.png" />
//       </head>
//       <body className="min-h-screen bg-gray-50 text-gray-900">
//         {children}
//       </body>
//     </html>
//   );
// }
