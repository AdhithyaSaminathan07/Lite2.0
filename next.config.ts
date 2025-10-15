// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };



// export default nextConfig;


// next.config.ts
import type { NextConfig } from "next";

// --- ADD THIS LINE ---
console.log(" MONGODB_URI on server start:", process.env.MONGODB_URI);
// --------------------

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Make sure this is your backend port
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Make sure this is your backend port
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;