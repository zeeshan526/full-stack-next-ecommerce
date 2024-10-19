import client from "@/app/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  pages: {
    error: '/auth/error', 
  },
  adapter: MongoDBAdapter(client),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
