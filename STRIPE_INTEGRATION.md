# Stripe Integration Guide

This document explains how Stripe is integrated with Better Auth for subscription management in the IT Learn platform.

## Overview

The IT Learn platform uses Stripe for payment processing and subscription management. The integration is designed to work seamlessly with Better Auth and includes:

- **Automatic customer creation** when users sign up
- **Subscription lifecycle management** (create, update, cancel)
- **Webhook processing** for real-time sync with Stripe
- **Trial abuse prevention** (one trial per user)
- **Payment history tracking** for invoicing and analytics

## Architecture

### Database Schema

The subscription system uses three main tables:

1. **`subscription_plan`** - Defines available subscription plans
   - Maps to Stripe Product and Price IDs
   - Stores trial period configuration
   - Includes plan features and pricing

2. **`subscription`** - Tracks user subscriptions
   - Links to user profiles
   - Stores Stripe customer and subscription IDs
   - Tracks trial periods and cancellation status

3. **`payment_history`** - Records all payment transactions
   - Links to subscriptions
   - Stores Stripe payment intent and invoice IDs
   - Tracks payment status and refunds

### Stripe Fields

The following fields connect to Stripe:

**subscription_plan table:**
- `stripePriceId` - Stripe Price ID (required)
- `stripeProductId` - Stripe Product ID (optional)
- `trialDays` - Trial period in days

**subscription table:**
- `stripeCustomerId` - Stripe Customer ID
- `stripeSubscriptionId` - Stripe Subscription ID
- `stripePriceId` - Current Stripe Price ID
- `stripeCurrentPeriodStart/End` - Billing period dates
- `stripeCancelAtPeriodEnd` - Cancellation flag
- `trialStart/End` - Trial period dates

**payment_history table:**
- `stripePaymentIntentId` - Payment Intent ID
- `stripeInvoiceId` - Invoice ID
- `stripeChargeId` - Charge ID

## Setup

### 1. Install Stripe SDK

```bash
bun add stripe
```

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_QUARTERLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_LIFETIME=price_...
```

### 3. Create Stripe Products

In the Stripe Dashboard:

1. Go to **Products**
2. Create products for each plan:
   - Pro Monthly (recurring: monthly)
   - Pro Quarterly (recurring: every 3 months)
   - Pro Yearly (recurring: yearly)
   - Lifetime (one-time payment)
3. Copy the Price IDs to your `.env` file

### 4. Set Up Webhooks

1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Usage

### Creating a Checkout Session

```typescript
import { createCheckoutSession } from "@/lib/stripe";

const session = await createCheckoutSession({
  priceId: process.env.STRIPE_PRICE_PRO_MONTHLY!,
  customerId: user.stripeCustomerId,
  userProfileId: user.id,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  trialDays: 7, // Optional trial period
});

// Redirect user to Stripe Checkout
redirect(session.url);
```

### Managing Subscriptions

```typescript
import {
  cancelSubscription,
  reactivateSubscription,
  updateSubscription,
} from "@/lib/stripe";

// Cancel at period end
await cancelSubscription(subscription.stripeSubscriptionId);

// Reactivate cancelled subscription
await reactivateSubscription(subscription.stripeSubscriptionId);

// Upgrade/downgrade plan
await updateSubscription({
  subscriptionId: subscription.stripeSubscriptionId,
  newPriceId: process.env.STRIPE_PRICE_PRO_YEARLY!,
});
```

### Customer Portal

```typescript
import { createBillingPortalSession } from "@/lib/stripe";

const session = await createBillingPortalSession({
  customerId: user.stripeCustomerId,
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
});

// Redirect to Stripe Customer Portal
redirect(session.url);
```

### Checking Subscription Status

```typescript
import { getUserSubscriptionStatus } from "@/lib/stripe";

const status = await getUserSubscriptionStatus(userProfileId);

if (status.isPro) {
  // User has Pro access
}

if (status.isLifetime) {
  // User has Lifetime access
}
```

## Webhook Handler

The webhook handler automatically syncs Stripe events with the database. It's already set up at `/lib/stripe/webhooks.ts`.

To use it in an API route:

```typescript
import { handleStripeWebhook } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  await handleStripeWebhook(event);

  return new Response(JSON.stringify({ received: true }));
}
```

## Trial Abuse Prevention

The system automatically prevents users from claiming multiple trials:

1. When a user starts a trial, `trialStart` is recorded
2. Before offering a trial, the system checks if `trialStart` exists
3. If a trial was used before, the user pays immediately

This works across all plans - if you used a trial on Monthly, you can't get a trial on Yearly.

## Features by Subscription Type

| Feature | Free | Pro | Lifetime |
|---------|------|-----|----------|
| Basic Courses | ✅ | ✅ | ✅ |
| All Courses | ❌ | ✅ | ✅ |
| Project Feedback | ❌ | ✅ | ✅ |
| Advanced Exercises | ❌ | ✅ | ✅ |
| Unlimited XP | ❌ | ✅ | ✅ |
| Certificates | ❌ | ✅ | ✅ |
| Auto-renew | N/A | ✅ | N/A |
| Price | Free | €9-29/mo | €299 |

## Testing

Use Stripe test mode cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

Use any future expiry date and any CVC.

## Production Checklist

Before going live:

- [ ] Switch to live Stripe keys
- [ ] Create live products and prices
- [ ] Set up live webhook endpoint
- [ ] Test checkout flow end-to-end
- [ ] Test webhook events
- [ ] Set up Stripe Radar for fraud prevention
- [ ] Configure tax settings in Stripe
- [ ] Set up invoicing email templates

## Support

For Stripe-related issues:

1. Check [Stripe Logs](https://dashboard.stripe.com/logs) for API errors
2. Check [Webhook Events](https://dashboard.stripe.com/webhooks) for delivery failures
3. Review payment intent status in Stripe Dashboard
4. Check application logs for webhook processing errors
