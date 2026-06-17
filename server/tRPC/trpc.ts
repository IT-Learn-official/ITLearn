import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { UserProfile } from "@prisma/client";
import type { TRPCContext } from "./context";

const isUserProfile = (value: unknown): value is UserProfile => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return "id" in value && "userId" in value && "role" in value;
};

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Middleware to ensure user is authenticated
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!(ctx.session && ctx.user)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
    },
  });
});

// Middleware to get user profile (includes role information)
const withUserProfile = t.middleware(async ({ ctx, next }) => {
  if (!(ctx.session && ctx.user)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  const profile = await ctx.db.userProfile.findFirst({
    where: { userId: ctx.user.id },
  });

  if (!isUserProfile(profile)) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User profile not found",
    });
  }

  if (profile.isBanned) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your account has been banned",
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user,
      userProfile: profile,
    },
  });
});

// Middleware to ensure user has a specific role.
// Must be chained after `withUserProfile` — the profile is expected
// to already be in the context so we don't query the database twice.
const hasRole = (
  roles: Array<"student" | "teacher" | "admin" | "school_admin">
) =>
  t.middleware(({ ctx, next }) => {
    const profile = ctx.userProfile;

    if (!isUserProfile(profile)) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "hasRole middleware must be chained after withUserProfile so the user profile is in context",
      });
    }

    if (!roles.includes(profile.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You must be a ${roles.join(" or ")} to access this resource`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        userProfile: profile,
      },
    });
  });

// Protected procedures
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const userProcedure = t.procedure.use(withUserProfile);

// Role-based procedures that compose withUserProfile to avoid duplicate queries
export const teacherProcedure = t.procedure
  .use(withUserProfile)
  .use(hasRole(["teacher", "admin"]));
export const adminProcedure = t.procedure
  .use(withUserProfile)
  .use(hasRole(["admin"]));
export const schoolAdminProcedure = t.procedure
  .use(withUserProfile)
  .use(hasRole(["school_admin", "admin"]));
