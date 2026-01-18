import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import { userProfile } from "../database/schemas/users";
import type { TRPCContext } from "./context";

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

  const profile = await ctx.db.query.userProfile.findFirst({
    where: eq(userProfile.userId, ctx.user.id),
  });

  if (!profile) {
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

// Middleware to ensure user has a specific role
const hasRole = (
  roles: Array<"student" | "teacher" | "admin" | "school_admin">
) =>
  t.middleware(async ({ ctx, next }) => {
    if (!(ctx.session && ctx.user)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to access this resource",
      });
    }

    const profile = await ctx.db.query.userProfile.findFirst({
      where: eq(userProfile.userId, ctx.user.id),
    });

    if (!profile) {
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

    if (!roles.includes(profile.role)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You must be a ${roles.join(" or ")} to access this resource`,
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

// Protected procedures
export const protectedProcedure = t.procedure.use(isAuthenticated);
export const userProcedure = t.procedure.use(withUserProfile);
export const teacherProcedure = t.procedure.use(hasRole(["teacher", "admin"]));
export const adminProcedure = t.procedure.use(hasRole(["admin"]));
export const schoolAdminProcedure = t.procedure.use(
  hasRole(["school_admin", "admin"])
);
