import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// If a global 'prisma' variable is already defined, use it; otherwise, create a new instance.
const client = globalThis.prisma || new PrismaClient();

// In a non-production environment, set the global 'prisma' variable to the 'client' instance.
if (process.env.NODE_ENV !== "production") globalThis.prisma = client;

export default client;
