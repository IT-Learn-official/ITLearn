import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, userProcedure } from "../trpc";

export const badgesRouter = createTRPCRouter({
  // Get all available badges
  getAll: publicProcedure.query(async ({ ctx }) => {
    const badges = await ctx.db.badge.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    return badges;
  }),

  // Get user's earned badges
  getMyBadges: userProcedure.query(async ({ ctx }) => {
    const userBadges = await ctx.db.userBadge.findMany({
      where: { userProfileId: ctx.userProfile.id },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: "desc" },
    });

    return userBadges;
  }),

  // Claim a badge
  claim: userProcedure
    .input(z.object({ badgeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user already has this badge
      const existing = await ctx.db.userBadge.findFirst({
        where: {
          userProfileId: ctx.userProfile.id,
          badgeId: input.badgeId,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Badge already claimed",
        });
      }

      // Get badge details
      const badgeDetails = await ctx.db.badge.findFirst({
        where: { id: input.badgeId },
      });

      if (!badgeDetails) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Badge not found",
        });
      }

      // Create user badge
      const newUserBadge = await ctx.db.userBadge.create({
        data: {
          id: crypto.randomUUID(),
          userProfileId: ctx.userProfile.id,
          badgeId: input.badgeId,
          earnedAt: new Date(),
          claimedAt: new Date(),
        },
      });

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
      const updated = await ctx.db.userBadge.update({
        where: { id: input.userBadgeId },
        data: { isDisplayed: input.isDisplayed },
      });

      return updated;
    }),
});
