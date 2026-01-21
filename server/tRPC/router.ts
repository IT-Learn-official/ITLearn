import { accountRouter } from "./routers/account";
import { adminRouter } from "./routers/admin";
import { badgesRouter } from "./routers/badges";
import { coursesRouter } from "./routers/courses";
import { healthRouter } from "./routers/health";
import { progressRouter } from "./routers/progress";
import { subscriptionsRouter } from "./routers/subscriptions";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  health: healthRouter,
  account: accountRouter,
  admin: adminRouter,
  courses: coursesRouter,
  progress: progressRouter,
  badges: badgesRouter,
  subscriptions: subscriptionsRouter,
});

export type AppRouter = typeof appRouter;
