/**
 * Stripe Integration for IT Learn Platform
 *
 * This module provides Stripe integration with Better Auth for subscription management.
 * It includes webhook handlers, utility functions, and configuration.
 *
 * @example
 * ```typescript
 * import { stripe, createCheckoutSession, handleStripeWebhook } from "@/lib/stripe";
 * ```
 */

export { stripeConfig } from "./config";
export * from "./utils";
export * from "./webhooks";
