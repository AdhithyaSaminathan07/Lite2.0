// // In: src/app/api/auth/[...nextauth]/route.ts
// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials"; // 1. Import CredentialsProvider

// const handler = NextAuth({
//   providers: [
//     // This is your existing Google provider. It remains unchanged.
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),

//     // 2. Add the Credentials provider for email/password login
//     CredentialsProvider({
//         name: 'Credentials',
//         credentials: {
//           // You can define any fields you expect here, but they are not displayed on the form.
//           email: { label: "Email", type: "email" },
//           password: { label: "Password", type: "password" }
//         },
//         async authorize(credentials) {
//             // This is where you check if the user's details are correct.
//             if (!credentials) {
//                 return null;
//             }

//             // Your demo credentials logic
//             const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };

//             if (
//               credentials.email === DEMO_CREDENTIALS.email &&
//               credentials.password === DEMO_CREDENTIALS.password
//             ) {
//               // If the credentials are valid, return a user object.
//               // This object will be stored in the session.
//               return { id: "demo-user-1", name: "Demo User", email: DEMO_CREDENTIALS.email };
//             }

//             // If the credentials are not valid, return null.
//             // NextAuth will then send an error back to the login form.
//             return null;
//         }
//     })
//   ],

//   // 3. (Recommended) Point to your custom login page
//   pages: {
//     signIn: '/login', // Replace with the actual path to your login page
//   },

//   // Your existing NEXTAUTH_SECRET remains unchanged.
//   secret: process.env.NEXTAUTH_SECRET,
// });

// export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// It's a good practice to put the auth options in a separate object
import { NextAuthOptions } from 'next-auth';

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
            // The middleware makes the header available on the Next.js request object `req`
            const tenantId = req.headers?.['x-tenant-id'];

            if (!tenantId) {
                console.error("Authorization Error: No Tenant ID provided in request.");
                return null; // Or throw an error
            }

            console.log(`Authorizing user for tenant: ${tenantId}`);

            // For now, your logic is for a demo user.
            // In a real app, you would also check the tenantId in your database.
            // e.g., const user = await User.findOne({ email: credentials.email, tenantId: tenantId });
            const DEMO_CREDENTIALS = { email: 'demo@billzzy.com', password: 'demo123' };

            if (
              credentials?.email === DEMO_CREDENTIALS.email &&
              credentials?.password === DEMO_CREDENTIALS.password
            ) {
              // IMPORTANT: Attach the tenantId to the user object you return
              return { 
                id: "demo-user-1", 
                name: "Demo User", 
                email: DEMO_CREDENTIALS.email,
                tenantId: tenantId // <-- Attach tenantId here
              };
            }

            return null;
        }
    })
  ],
  callbacks: {
    // This callback is used to add the tenantId to the JWT
    async jwt({ token, user }) {
      if (user) {
        // On sign in, the `user` object from `authorize` is available
        token.tenantId = (user as any).tenantId;
      }
      return token;
    },
    // This callback is used to add the tenantId to the session object
    async session({ session, token }) {
      // The token now has the tenantId we added in the `jwt` callback
      if (session.user && token.tenantId) {
        (session.user as any).tenantId = token.tenantId;
      }
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