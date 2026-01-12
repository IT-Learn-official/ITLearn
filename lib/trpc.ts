import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@/server/tRPC/router";

export const trpc = createTRPCReact<AppRouter>();
