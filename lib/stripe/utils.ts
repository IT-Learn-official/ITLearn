/**
 * Stripe Utility Functions for IT Learn Platform
 *
 * Helper functions for common Stripe operations:
 * - Creating customers
 * - Managing subscriptions
 * - Handling trials
 */

import Stripe from "stripe";
import { stripeConfig } from "./config";
import { db } from "@/server/database";
import { subscription, subscriptionPlan } from "@/server/database/schemas/subscriptions";
import { userProfile } from "@/server/database/schemas/users";
import { eq } from "drizzle-orm";

// Initialize Stripe client
export const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

/**
 * Create a Stripe customer for a user
 * Automatically called when user signs up if autoCreateCustomer is enabled
 */
export async function createStripeCustomer(params: {
  userId: string;
  email: string;
  name: string;
}) {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      userId: params.userId,
    },
  });

  return customer;
}

/**
 * Create a subscription for a user
 * Handles trial periods and trial abuse prevention
 */
export async function createSubscription(params: {
  userProfileId: string;
  priceId: string;
  customerId: string;
  trialDays?: number;
}) {
  const { userProfileId, priceId, customerId, trialDays } = params;

  // Check if user has already used a trial (trial abuse prevention)
  const hasUsedTrial = await checkUserTrialHistory(userProfileId);

  const subscriptionData: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    metadata: {
      userProfileId,
    },
  };

  // Only add trial if user hasn't used one before and trial is requested
  if (trialDays && trialDays > 0 && !hasUsedTrial) {
    subscriptionData.trial_period_days = trialDays;
  }

  const stripeSubscription = await stripe.subscriptions.create(subscriptionData);

  return stripeSubscription;
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(subscriptionId: string) {
  const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });

  return stripeSubscription;
}

/**
 * Immediately cancel a subscription
 */
export async function cancelSubscriptionImmediately(subscriptionId: string) {
  const stripeSubscription = await stripe.subscriptions.cancel(subscriptionId);

  return stripeSubscription;
}

/**
 * Reactivate a cancelled subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
  const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });

  return stripeSubscription;
}

/**
 * Update subscription to a new plan
 */
export async function updateSubscription(params: {
  subscriptionId: string;
  newPriceId: string;
  prorationBehavior?: "create_prorations" | "none" | "always_invoice";
}) {
  const { subscriptionId, newPriceId, prorationBehavior = "create_prorations" } = params;

  const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: stripeSubscription.items.data[0]?.id,
        price: newPriceId,
      },
    ],
    proration_behavior: prorationBehavior,
  });

  return updatedSubscription;
}

/**
 * Create a Stripe Checkout Session for subscription
 */
export async function createCheckoutSession(params: {
  priceId: string;
  customerId: string;
  userProfileId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}) {
  const { priceId, customerId, userProfileId, successUrl, cancelUrl, trialDays } = params;

  // Check if user has already used a trial
  const hasUsedTrial = await checkUserTrialHistory(userProfileId);

  const sessionData: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userProfileId,
    },
  };

  // Add trial if applicable
  if (trialDays && trialDays > 0 && !hasUsedTrial) {
    sessionData.subscription_data = {
      trial_period_days: trialDays,
    };
  }

  const session = await stripe.checkout.sessions.create(sessionData);

  return session;
}

/**
 * Create a billing portal session for subscription management
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return session;
}

/**
 * Check if user has already used a trial
 * Prevents trial abuse by checking subscription history
 */
async function checkUserTrialHistory(userProfileId: string): Promise<boolean> {
  const userSubscriptions = await db.query.subscription.findMany({
    where: eq(subscription.userProfileId, userProfileId),
  });

  // User has used trial if any subscription had a trial period
  return userSubscriptions.some((sub) => sub.trialStart !== null);
}

/**
 * Get subscription status for a user
 */
export async function getUserSubscriptionStatus(userProfileId: string) {
  const userSub = await db.query.subscription.findFirst({
    where: eq(subscription.userProfileId, userProfileId),
    with: {
      plan: true,
    },
  });

  if (!userSub) {
    return {
      isPro: false,
      isLifetime: false,
      type: "free" as const,
      status: "free" as const,
    };
  }

  const isPro = userSub.plan.type === "pro_yearly";
  const isLifetime = userSub.plan.type === "lifetime";

  return {
    isPro: isPro || isLifetime,
    isLifetime,
    type: userSub.plan.type,
    status: userSub.status,
    subscription: userSub,
  };
}
