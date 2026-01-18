import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  paymentHistory,
  subscription,
  subscriptionPlan,
} from "@/server/database/schemas/subscriptions";
import { adminProcedure, createTRPCRouter, userProcedure } from "../trpc";

export const subscriptionsRouter = createTRPCRouter({
  // Get all available subscription plans
  getPlans: userProcedure.query(async ({ ctx }) => {
    const plans = await ctx.db.query.subscriptionPlan.findMany({
      where: eq(subscriptionPlan.isActive, true),
      orderBy: (plan, { asc }) => [asc(plan.displayOrder)],
    });

    return plans;
  }),

  // Get current user's subscription
  getMy: userProcedure.query(async ({ ctx }) => {
    const userSubscription = await ctx.db.query.subscription.findFirst({
      where: eq(subscription.userProfileId, ctx.userProfile.id),
      with: {
        plan: true,
      },
    });

    return userSubscription;
  }),

  // Get subscription status (for feature flags)
  getStatus: userProcedure.query(async ({ ctx }) => {
    const userSubscription = await ctx.db.query.subscription.findFirst({
      where: eq(subscription.userProfileId, ctx.userProfile.id),
      with: {
        plan: true,
      },
    });

    if (!userSubscription?.plan) {
      return {
        type: "free" as const,
        isActive: true,
        isPro: false,
        isLifetime: false,
        endDate: null,
      };
    }

    const planType = userSubscription.plan.type;
    const isPro =
      planType === "pro_monthly" ||
      planType === "pro_quarterly" ||
      planType === "pro_yearly";

    const isLifetime = planType === "lifetime";

    return {
      type: planType,
      isActive: userSubscription.status === "active",
      isPro,
      isLifetime,
      endDate: userSubscription.endDate,
    };
  }),

  // Get payment history
  getPaymentHistory: userProcedure.query(async ({ ctx }) => {
    const payments = await ctx.db.query.paymentHistory.findMany({
      where: eq(paymentHistory.userProfileId, ctx.userProfile.id),
      orderBy: (payment, { desc }) => [desc(payment.createdAt)],
    });

    return payments;
  }),

  // Create a subscription (for testing - in production this would be handled by payment provider webhook)
  create: adminProcedure
    .input(
      z.object({
        userProfileId: z.string(),
        planId: z.string(),
        startDate: z.date(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [newSubscription] = await ctx.db
        .insert(subscription)
        .values({
          id: crypto.randomUUID(),
          userProfileId: input.userProfileId,
          planId: input.planId,
          status: "active",
          startDate: input.startDate,
          endDate: input.endDate ?? null,
        })
        .returning();

      return newSubscription;
    }),

  // Cancel subscription
  cancel: userProcedure
    .input(
      z.object({
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userSubscription = await ctx.db.query.subscription.findFirst({
        where: eq(subscription.userProfileId, ctx.userProfile.id),
      });

      if (!userSubscription) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active subscription found",
        });
      }

      const [cancelled] = await ctx.db
        .update(subscription)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: input.reason,
          autoRenew: false,
        })
        .where(eq(subscription.id, userSubscription.id))
        .returning();

      return cancelled;
    }),
});
