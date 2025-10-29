// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Scans the pages directory
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Scans the components directory
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Scans the app directory (for Next.js App Router)
  ],
  theme: {
    extend: {
      // You can define your custom colors (like `primary` and `secondary` here)
      colors: {
        'primary': '#1D4ED8', // Example color
        'secondary': '#4F46E5', // Example color
      }
    },
  },
  plugins: [],
}