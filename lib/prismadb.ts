import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-unused-vars, no-var
  var prisma: PrismaClient | undefined;
}

// Create a new instance only if 'prisma' is not already defined.
const client = globalThis.prisma || new PrismaClient();

// In a non-production environment, set the global 'prisma' variable to the 'client' instance.
if (process.env.NODE_ENV !== "production" && !globalThis.prisma) {
  globalThis.prisma = client;
}

export default client;
