import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { db } from "../database";

export const createTRPCContext = ({ req }: FetchCreateContextFnOptions) => {
  return { db, headers: req.headers };
};

export type TRPCContext = ReturnType<typeof createTRPCContext>;
