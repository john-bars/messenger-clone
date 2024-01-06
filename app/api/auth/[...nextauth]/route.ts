import NextAuth from "next-auth/next";
import { authOptions } from "../options";

// Create the NextAuth handler using the defined options.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
