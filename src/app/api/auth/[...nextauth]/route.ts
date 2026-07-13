import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("StudentDash");

        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        if (!existingUser) {
          await usersCollection.insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date(),
          });
        }

        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };