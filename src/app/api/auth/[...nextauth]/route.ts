// // // In: src/app/api/auth/[...nextauth]/route.ts
// import NextAuth, { NextAuthOptions } from "next-auth";
// // FIX 2 (Warning): Removed unused 'JWT' import
// // import { JWT } from "next-auth/jwt"; 
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

// // By using module augmentation, you are telling TypeScript what the shape
// // of your User, Session, and JWT objects should be.
// declare module "next-auth" {
//   interface Session {
//     user: {
//       tenantId?: string | unknown; // Use 'unknown' if you are not sure of the type initially
//     } & {
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }

//   interface User {
//     tenantId?: string | unknown;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     tenantId?: string | unknown;
//   }
// }

// // FIX 1 (Error): Removed the "export" keyword. This object should not be exported from a route file.
// const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials, req) {
//         const tenantId = req.headers?.['x-tenant-id'];

//         if (!tenantId) {
//           console.error("Authorization Error: No Tenant ID provided in request.");
//           return null;
//         }

//         console.log(`Authorizing user for tenant: ${tenantId}`);
//         const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };

//         if (
//           credentials?.email === DEMO_CREDENTIALS.email &&
//           credentials?.password === DEMO_CREDENTIALS.password
//         ) {
//           return {
//             id: "demo-user-1",
//             name: "Demo User",
//             email: DEMO_CREDENTIALS.email,
//             tenantId: tenantId // <-- Attach tenantId here
//           };
//         }

//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.tenantId = user.tenantId;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user && token.tenantId) {
//         session.user.tenantId = token.tenantId;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/login',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


// // src/app/api/auth/[...nextauth]/route.ts

// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

// // Your 'declare module' augmentations are correct, no changes needed here.
// declare module "next-auth" {
//   interface Session {
//     user: {
//       tenantId?: string | unknown;
//     } & {
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }
//   interface User {
//     tenantId?: string | unknown;
//   }
// }
// declare module "next-auth/jwt" {
//   interface JWT {
//     tenantId?: string | unknown;
//   }
// }

// // --- THIS IS THE FIX ---
// // Add the 'export' keyword back. This allows other files to import your configuration.
// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials, req) {
//         // Your authorize logic is fine, no changes needed here
//         const tenantId = req.headers?.['x-tenant-id'];
//         if (!tenantId) {
//           console.error("Authorization Error: No Tenant ID provided in request.");
//           return null;
//         }
//         console.log(`Authorizing user for tenant: ${tenantId}`);
//         const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };
//         if (
//           credentials?.email === DEMO_CREDENTIALS.email &&
//           credentials?.password === DEMO_CREDENTIALS.password
//         ) {
//           return {
//             id: "demo-user-1",
//             name: "Demo User",
//             email: DEMO_CREDENTIALS.email,
//             tenantId: tenantId
//           };
//         }
//         return null;
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.tenantId = user.tenantId;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user && token.tenantId) {
//         session.user.tenantId = token.tenantId;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/login',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// // This part remains the same
// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
// Import the configuration from your new central file
import { authOptions } from "@/lib/auth";

// Initialize NextAuth with the imported options
const handler = NextAuth(authOptions);

// Export the handlers as required by Next.js
export { handler as GET, handler as POST };