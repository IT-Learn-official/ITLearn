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
  const periodWindow = getSubscriptionPeriodWindow(stripeSubscription);

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
      stripeCurrentPeriodStart:
        periodWindow.start !== null
          ? new Date(periodWindow.start * 1000)
          : null,
      stripeCurrentPeriodEnd:
        periodWindow.end !== null ? new Date(periodWindow.end * 1000) : null,
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
  const periodWindow = getSubscriptionPeriodWindow(stripeSubscription);

  await db
    .update(subscription)
    .set({
      stripePriceId: stripeSubscription.items.data[0]?.price.id,
      status: mapStripeStatus(stripeSubscription.status),
      stripeCurrentPeriodStart:
        periodWindow.start !== null
          ? new Date(periodWindow.start * 1000)
          : null,
      stripeCurrentPeriodEnd:
        periodWindow.end !== null ? new Date(periodWindow.end * 1000) : null,
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
  const paymentDetails = getInvoicePaymentDetails(invoice);
  const invoiceSubscriptionId = getInvoiceSubscriptionId(invoice);

  if (!invoiceSubscriptionId) {
    throw new Error(`Subscription not found on invoice payload: ${invoice.id}`);
  }

  // Find subscription by Stripe subscription ID
  const sub = await db.query.subscription.findFirst({
    where: eq(subscription.stripeSubscriptionId, invoiceSubscriptionId),
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
    paymentMethod:
      paymentDetails.paymentIntentId || paymentDetails.chargeId
        ? "stripe"
        : "unknown",
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId: paymentDetails.paymentIntentId ?? undefined,
    stripeChargeId: paymentDetails.chargeId ?? undefined,
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
  const paymentDetails = getInvoicePaymentDetails(invoice);
  const invoiceSubscriptionId = getInvoiceSubscriptionId(invoice);

  if (!invoiceSubscriptionId) {
    throw new Error(
      `Subscription not found on failed invoice payload: ${invoice.id}`
    );
  }

  const sub = await db.query.subscription.findFirst({
    where: eq(subscription.stripeSubscriptionId, invoiceSubscriptionId),
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
    paymentMethod:
      paymentDetails.paymentIntentId || paymentDetails.chargeId
        ? "stripe"
        : "unknown",
    stripeInvoiceId: invoice.id,
    stripePaymentIntentId: paymentDetails.paymentIntentId ?? undefined,
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

function getSubscriptionPeriodWindow(stripeSubscription: Stripe.Subscription): {
  start: number | null;
  end: number | null;
} {
  const items = stripeSubscription.items?.data ?? [];

  if (items.length === 0) {
    return { start: null, end: null };
  }

  const maxStart = Math.max(...items.map((item) => item.current_period_start));
  const maxEnd = Math.max(...items.map((item) => item.current_period_end));

  return {
    start: Number.isFinite(maxStart) ? maxStart : null,
    end: Number.isFinite(maxEnd) ? maxEnd : null,
  };
}

function normalizeStripeId(
  value: string | { id: string } | null | undefined
): string | null {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "id" in value) {
    return value.id;
  }

  return null;
}

function getInvoicePaymentDetails(invoice: Stripe.Invoice): {
  paymentIntentId: string | null;
  chargeId: string | null;
} {
  const payments = invoice.payments?.data ?? [];

  const paymentIntent =
    payments.find((payment) => payment.payment.type === "payment_intent")
      ?.payment.payment_intent ?? null;
  const charge =
    payments.find((payment) => payment.payment.type === "charge")?.payment
      .charge ?? null;

  return {
    paymentIntentId: normalizeStripeId(paymentIntent),
    chargeId: normalizeStripeId(charge),
  };
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const lines = invoice.lines?.data ?? [];

  const subscriptionLine =
    lines.find((line) => line.subscription) ??
    lines.find(
      (line) => line.parent?.subscription_item_details?.subscription
    ) ??
    lines.find((line) => line.parent?.invoice_item_details?.subscription);

  const subscriptionId =
    subscriptionLine?.subscription ??
    subscriptionLine?.parent?.subscription_item_details?.subscription ??
    subscriptionLine?.parent?.invoice_item_details?.subscription ??
    null;

  return normalizeStripeId(subscriptionId);
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
