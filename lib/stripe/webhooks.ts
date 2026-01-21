/**
 * Stripe Webhook Handler for IT Learn Platform
 *
 * This file handles Stripe webhook events and syncs subscription data
 * with the database. It processes events like:
 * - Subscription creation, updates, and cancellations
 * - Payment successes and failures
 * - Customer updates
 */

import { eq } from "drizzle-orm";
import type { Stripe } from "stripe";
import { db } from "@/server/database";
import {
  paymentHistory,
  subscription,
} from "@/server/database/schemas/subscriptions";

/**
 * Handle customer.subscription.created event
 * Creates or updates subscription record when a user subscribes
 */
export async function handleSubscriptionCreated(
  event: Stripe.CustomerSubscriptionCreatedEvent
) {
  const stripeSubscription = event.data.object;

  // Find user by Stripe customer ID
  const existingSubscription = await db.query.subscription.findFirst({
    where: eq(
      subscription.stripeCustomerId,
      stripeSubscription.customer as string
    ),
  });

  if (!existingSubscription) {
    throw new Error(
      `Subscription record not found for Stripe customer ${stripeSubscription.customer}`
    );
  }

  // Update subscription with Stripe data
  await db
    .update(subscription)
    .set({
      stripeSubscriptionId: stripeSubscription.id,
      stripePriceId: stripeSubscription.items.data[0]?.price.id,
      status: mapStripeStatus(stripeSubscription.status),
      stripeCurrentPeriodStart: new Date(
        stripeSubscription.current_period_start * 1000
      ),
      stripeCurrentPeriodEnd: new Date(
        stripeSubscription.current_period_end * 1000
      ),
      stripeCancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      trialStart: stripeSubscription.trial_start
        ? new Date(stripeSubscription.trial_start * 1000)
        : null,
      trialEnd: stripeSubscription.trial_end
        ? new Date(stripeSubscription.trial_end * 1000)
        : null,
      updatedAt: new Date(),
    })
    .where(
      eq(subscription.stripeCustomerId, stripeSubscription.customer as string)
    );
}

/**
 * Handle customer.subscription.updated event
 * Updates subscription when plan changes or status updates
 */
export async function handleSubscriptionUpdated(
  event: Stripe.CustomerSubscriptionUpdatedEvent
) {
  const stripeSubscription = event.data.object;

  await db
    .update(subscription)
    .set({
      stripePriceId: stripeSubscription.items.data[0]?.price.id,
      status: mapStripeStatus(stripeSubscription.status),
      stripeCurrentPeriodStart: new Date(
        stripeSubscription.current_period_start * 1000
      ),
      stripeCurrentPeriodEnd: new Date(
        stripeSubscription.current_period_end * 1000
      ),
      stripeCancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      cancelledAt: stripeSubscription.canceled_at
        ? new Date(stripeSubscription.canceled_at * 1000)
        : null,
      updatedAt: new Date(),
    })
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id));
}

/**
 * Handle customer.subscription.deleted event
 * Marks subscription as cancelled when deleted in Stripe
 */
export async function handleSubscriptionDeleted(
  event: Stripe.CustomerSubscriptionDeletedEvent
) {
  const stripeSubscription = event.data.object;

  await db
    .update(subscription)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id));
}

/**
 * Handle invoice.payment_succeeded event
 * Records successful payment in payment history
 */
export async function handlePaymentSucceeded(
  event: Stripe.InvoicePaymentSucceededEvent
) {
  const invoice = event.data.object;

  // Find subscription by Stripe subscription ID
  const sub = await db.query.subscription.findFirst({
    where: eq(
      subscription.stripeSubscriptionId,
      invoice.subscription as string
    ),
  });

  if (!sub) {
    throw new Error(`Subscription not found for invoice: ${invoice.id}`);
  }

  // Record payment in history
  await db.insert(paymentHistory).values({
    id: crypto.randomUUID(),
    subscriptionId: sub.id,
    userProfileId: sub.userProfileId,
    amount: (invoice.amount_paid / 100).toString(),
    currency: invoice.currency.toUpperCase(),
    status: "completed",
    paymentMethod: invoice.payment_intent ? "stripe" : "unknown",
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId: invoice.payment_intent as string,
    stripeChargeId: invoice.charge as string,
    invoiceUrl: invoice.hosted_invoice_url || undefined,
    paidAt: invoice.status_transitions.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000)
      : undefined,
    metadata: JSON.stringify({
      billingReason: invoice.billing_reason,
      invoiceNumber: invoice.number,
    }),
  });
}

/**
 * Handle invoice.payment_failed event
 * Records failed payment in payment history
 */
export async function handlePaymentFailed(
  event: Stripe.InvoicePaymentFailedEvent
) {
  const invoice = event.data.object;

  const sub = await db.query.subscription.findFirst({
    where: eq(
      subscription.stripeSubscriptionId,
      invoice.subscription as string
    ),
  });

  if (!sub) {
    throw new Error(`Subscription not found for failed invoice: ${invoice.id}`);
  }

  await db.insert(paymentHistory).values({
    id: crypto.randomUUID(),
    subscriptionId: sub.id,
    userProfileId: sub.userProfileId,
    amount: (invoice.amount_due / 100).toString(),
    currency: invoice.currency.toUpperCase(),
    status: "failed",
    paymentMethod: invoice.payment_intent ? "stripe" : "unknown",
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId: invoice.payment_intent as string,
    metadata: JSON.stringify({
      billingReason: invoice.billing_reason,
      attemptCount: invoice.attempt_count,
      lastPaymentError: invoice.last_finalization_error?.message,
    }),
  });
}

/**
 * Map Stripe subscription status to internal status
 */
function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): "active" | "cancelled" | "expired" | "pending" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "canceled":
      return "cancelled";
    case "past_due":
    case "unpaid":
      return "expired";
    case "incomplete":
    case "incomplete_expired":
      return "pending";
    default:
      return "pending";
  }
}

/**
 * Main webhook handler
 * Routes webhook events to appropriate handlers
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case "customer.subscription.created":
      await handleSubscriptionCreated(event);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event);
      break;
    case "invoice.payment_succeeded":
      await handlePaymentSucceeded(event);
      break;
    case "invoice.payment_failed":
      await handlePaymentFailed(event);
      break;
    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }
}
