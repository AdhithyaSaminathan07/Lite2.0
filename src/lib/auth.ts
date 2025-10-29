// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // Credentials provider for email/password login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        // Demo credentials logic
        const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };

        if (
          credentials.email === DEMO_CREDENTIALS.email &&
          credentials.password === DEMO_CREDENTIALS.password
        ) {
          return { id: "demo-user-1", name: "Demo User", email: DEMO_CREDENTIALS.email };
        }

        // If credentials are not valid, return null
        return null;
      }
    })
  ],

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};