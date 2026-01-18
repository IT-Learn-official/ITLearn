import { drizzle } from "drizzle-orm/node-postgres";
import {
  account,
  accountRelations,
  rateLimit,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "./schemas/auth";

export const db = drizzle(process.env.DATABASE_URL || "", {
  schema: {
    account,
    accountRelations,
    rateLimit,
    session,
    sessionRelations,
    user,
    userRelations,
    verification,
  },
});
