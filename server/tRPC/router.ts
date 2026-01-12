import { accountRouter } from "./routers/account";
import { adminRouter } from "./routers/admin";
import { healthRouter } from "./routers/health";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  account: accountRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
