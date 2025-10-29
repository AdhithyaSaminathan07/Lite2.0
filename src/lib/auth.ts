// // src/lib/auth.ts

// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     // Google provider
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),

//     // Credentials provider for email/password login
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials) {
//           return null;
//         }

//         // Demo credentials logic
//         const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };

//         if (
//           credentials.email === DEMO_CREDENTIALS.email &&
//           credentials.password === DEMO_CREDENTIALS.password
//         ) {
//           return { id: "demo-user-1", name: "Demo User", email: DEMO_CREDENTIALS.email };
//         }

//         // If credentials are not valid, return null
//         return null;
//       }
//     })
//   ],

//   pages: {
//     signIn: '/login',
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// ADD THIS: This is needed to add custom properties to the session and user types for TypeScript.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      shopName?: string | null;
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    shopName?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };
        
        if (credentials.email === DEMO_CREDENTIALS.email && credentials.password === DEMO_CREDENTIALS.password) {
          return { id: "demo-user-1", name: "Demo User", email: DEMO_CREDENTIALS.email };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,

  // ADD THIS SECTION: This tells Next-Auth to use JWTs and defines how to handle them.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This callback is called when a JWT is created. We add the user's ID to the token.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // This callback is called when a session is checked. We add the ID from the token to the session object.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};