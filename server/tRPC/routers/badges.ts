import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { badge, userBadge } from "@/server/database/schemas/badges";
import { createTRPCRouter, publicProcedure, userProcedure } from "../trpc";

export const badgesRouter = createTRPCRouter({
  // Get all available badges
  getAll: publicProcedure.query(async ({ ctx }) => {
    const badges = await ctx.db.query.badge.findMany({
      where: eq(badge.isActive, true),
      orderBy: (badge, { asc }) => [asc(badge.displayOrder)],
    });

    return badges;
  }),

  // Get user's earned badges
  getMyBadges: userProcedure.query(async ({ ctx }) => {
    const userBadges = await ctx.db.query.userBadge.findMany({
      where: eq(userBadge.userProfileId, ctx.userProfile.id),
      with: {
        badge: true,
      },
      orderBy: (userBadge, { desc }) => [desc(userBadge.earnedAt)],
    });

    return userBadges;
  }),

  // Claim a badge
  claim: userProcedure
    .input(z.object({ badgeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user already has this badge
      const existing = await ctx.db.query.userBadge.findFirst({
        where: (ub, { and, eq }) =>
          and(
            eq(ub.userProfileId, ctx.userProfile.id),
            eq(ub.badgeId, input.badgeId)
          ),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Badge already claimed",
        });
      }

      // Get badge details
      const badgeDetails = await ctx.db.query.badge.findFirst({
        where: eq(badge.id, input.badgeId),
      });

      if (!badgeDetails) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Badge not found",
        });
      }

      // Create user badge
      const [newUserBadge] = await ctx.db
        .insert(userBadge)
        .values({
          id: crypto.randomUUID(),
          userProfileId: ctx.userProfile.id,
          badgeId: input.badgeId,
          earnedAt: new Date(),
          claimedAt: new Date(),
        })
        .returning();

      return newUserBadge;
    }),

  // Toggle badge display on profile
  toggleDisplay: userProcedure
    .input(
      z.object({
        userBadgeId: z.string(),
        isDisplayed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(userBadge)
        .set({ isDisplayed: input.isDisplayed })
        .where(eq(userBadge.id, input.userBadgeId))
        .returning();

      return updated;
    }),
});
