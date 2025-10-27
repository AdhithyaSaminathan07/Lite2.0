// src/lib/auth.ts

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Your 'declare module' augmentations belong here now.
declare module "next-auth" {
  interface Session {
    user: {
      tenantId?: string | unknown;
    } & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    tenantId?: string | unknown;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string | unknown;
  }
}

// Define and export your authOptions from this central file.
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
      async authorize(credentials, req) {
        const tenantId = req.headers?.['x-tenant-id'];
        if (!tenantId) {
          console.error("Authorization Error: No Tenant ID provided in request.");
          return null;
        }
        console.log(`Authorizing user for tenant: ${tenantId}`);
        const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };
        if (
          credentials?.email === DEMO_CREDENTIALS.email &&
          credentials?.password === DEMO_CREDENTIALS.password
        ) {
          return {
            id: "demo-user-1",
            name: "Demo User",
            email: DEMO_CREDENTIALS.email,
            tenantId: tenantId
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.tenantId) {
        session.user.tenantId = token.tenantId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};