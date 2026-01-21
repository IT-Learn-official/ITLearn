import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { auth } from "@/lib/auth";
import { db } from "../database";

export const createTRPCContext = async ({
  req,
}: FetchCreateContextFnOptions) => {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;

  try {
    session = await auth.api.getSession({ headers: req.headers });
  } catch (error) {
    // Log the error but allow the context to be created
    // Authentication will be enforced by middleware on protected routes
    console.error("Error getting session:", error);
  }

  return {
    db,
    headers: req.headers,
    session,
    user: session?.user ?? null,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
