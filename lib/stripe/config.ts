/**
 * Stripe Integration Configuration for IT Learn Platform
 *
 * This file configures Stripe integration with Better Auth.
 * The Better Auth Stripe plugin handles:
 * - Automatic Stripe customer creation on user signup
 * - Subscription lifecycle management
 * - Webhook processing with signature verification
 * - Trial abuse prevention (one trial per user across all plans)
 */

import type Stripe from "stripe";

export const stripeConfig = {
  // Stripe API Keys (from environment variables)
  secretKey: process.env.STRIPE_SECRET_KEY || "",
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",

  // Subscription Plans Mapping
  // Map internal subscription types to Stripe Price IDs
  plans: {
    pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || "", // €9/month billed annually
    lifetime: process.env.STRIPE_PRICE_LIFETIME || "", // €69 one-time
  },

  // Feature Configuration
  features: {
    // Automatically create Stripe customers on user signup
    autoCreateCustomer: true,

    // Enable trial period support
    enableTrials: true,

    // Trial abuse prevention (one trial per user)
    preventTrialAbuse: true,

    // Allow subscription upgrades/downgrades
    allowPlanChanges: true,
  },

  // Webhook Events to Handle
  webhookEvents: [
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "customer.created",
    "customer.updated",
    "charge.succeeded",
    "charge.failed",
    "charge.refunded",
  ] as const,

  // Default Trial Period (in days)
  defaultTrialDays: 7,

  // Billing Configuration
  billing: {
    currency: "EUR",
    taxBehavior: "exclusive" as const,
    collectionMethod: "charge_automatically" as const,
  },
} as const;

export type StripeConfig = typeof stripeConfig;
