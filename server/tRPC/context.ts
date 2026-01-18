import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { auth } from "@/lib/auth";
import { db } from "../database";

export const createTRPCContext = async ({
  req,
}: FetchCreateContextFnOptions) => {
  const session = await auth.api.getSession({ headers: req.headers });

  return {
    db,
    headers: req.headers,
    session,
    user: session?.user ?? null,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
