// In: src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// --- TYPE AUGMENTATION ---
// This tells TypeScript the correct shape of our session and token.
declare module "next-auth" {
  interface Session {
    user: {
      tenantId: string; // tenantId is a required string
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
    tenantId: string; // tenantId is a required string
  }
}

// =================================================================
// CRITICAL FIX: `authOptions` MUST be exported.
// =================================================================
export const authOptions: NextAuthOptions = {
  // Explicitly define the session strategy. This is best practice.
  session: {
    strategy: "jwt",
  },
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
        if (!tenantId) return null;
        const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };
        if (credentials?.email === DEMO_CREDENTIALS.email && credentials?.password === DEMO_CREDENTIALS.password) {
          return { id: "demo-user-1", name: "Demo User", email: DEMO_CREDENTIALS.email, tenantId: tenantId };
        }
        return null;
      }
    })
  ],
  callbacks: {
    // =================================================================
    // CRITICAL FIX: This robust `jwt` callback ensures tenantId is added on sign-in.
    // =================================================================
    async jwt({ token, user, account }) {
      // This block runs ONLY on initial sign-in.
      if (user && account) {
        const tenantId = (account.provider === 'google' && user.email) 
          ? user.email 
          : user.tenantId as string;
        
        if (tenantId) {
          token.tenantId = tenantId;
        }
      }
      // On subsequent requests, the token is returned as-is.
      return token;
    },
    async session({ session, token }) {
      // This copies the tenantId from the token to the session object.
      session.user.tenantId = token.tenantId;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };