import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { userProfile } from "./users";

// Subscription type enum
export const subscriptionTypeEnum = pgEnum("subscription_type", [
  "free",
  "pro_yearly", // €9/month billed annually (€108/year)
  "lifetime", // €69 one-time
]);

// Subscription status enum
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "cancelled",
  "expired",
  "pending",
]);

// Payment status enum
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

// Subscription types/plans configuration
export const subscriptionPlan = pgTable("subscription_plan", {
  id: text("id").primaryKey(),
  type: subscriptionTypeEnum("type").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("EUR").notNull(),
  durationDays: integer("duration_days"), // null for lifetime
  features: text("features").array(), // JSON array of features
  // Stripe integration fields
  stripePriceId: text("stripe_price_id").unique(), // Stripe Price ID
  stripeProductId: text("stripe_product_id"), // Stripe Product ID
  trialDays: integer("trial_days").default(0), // Trial period in days
  isActive: boolean("is_active").default(true).notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// User subscriptions
export const subscription = pgTable(
  "subscription",
  {
    id: text("id").primaryKey(),
    userProfileId: text("user_profile_id")
      .notNull()
      .unique()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    planId: text("plan_id")
      .notNull()
      .references(() => subscriptionPlan.id),
    status: subscriptionStatusEnum("status").default("active").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"), // null for lifetime
    autoRenew: boolean("auto_renew").default(false).notNull(),
    cancelledAt: timestamp("cancelled_at"),
    cancellationReason: text("cancellation_reason"),
    // Stripe integration fields
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    stripePriceId: text("stripe_price_id"),
    stripeCurrentPeriodStart: timestamp("stripe_current_period_start"),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
    stripeCancelAtPeriodEnd: boolean("stripe_cancel_at_period_end").default(false),
    trialStart: timestamp("trial_start"),
    trialEnd: timestamp("trial_end"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("subscription_userProfileId_idx").on(table.userProfileId),
    index("subscription_status_idx").on(table.status),
    index("subscription_endDate_idx").on(table.endDate),
    index("subscription_stripeCustomerId_idx").on(table.stripeCustomerId),
    index("subscription_stripeSubscriptionId_idx").on(table.stripeSubscriptionId),
  ]
);

// Payment history
export const paymentHistory = pgTable(
  "payment_history",
  {
    id: text("id").primaryKey(),
    subscriptionId: text("subscription_id")
      .notNull()
      .references(() => subscription.id),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").default("EUR").notNull(),
    status: paymentStatusEnum("status").default("pending").notNull(),
    paymentMethod: text("payment_method"),
    transactionId: text("transaction_id").unique(),
    invoiceUrl: text("invoice_url"),
    metadata: text("metadata"), // JSON for additional data
    // Stripe integration fields
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    stripeInvoiceId: text("stripe_invoice_id").unique(),
    stripeChargeId: text("stripe_charge_id"),
    paidAt: timestamp("paid_at"),
    refundedAt: timestamp("refunded_at"),
    refundReason: text("refund_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("payment_history_subscriptionId_idx").on(table.subscriptionId),
    index("payment_history_userProfileId_idx").on(table.userProfileId),
    index("payment_history_status_idx").on(table.status),
    index("payment_history_transactionId_idx").on(table.transactionId),
    index("payment_history_stripePaymentIntentId_idx").on(table.stripePaymentIntentId),
  ]
);

// Relations
export const subscriptionPlanRelations = relations(
  subscriptionPlan,
  ({ many }) => ({
    subscriptions: many(subscription),
  })
);

export const subscriptionRelations = relations(
  subscription,
  ({ one, many }) => ({
    userProfile: one(userProfile, {
      fields: [subscription.userProfileId],
      references: [userProfile.id],
    }),
    plan: one(subscriptionPlan, {
      fields: [subscription.planId],
      references: [subscriptionPlan.id],
    }),
    payments: many(paymentHistory),
  })
);

export const paymentHistoryRelations = relations(paymentHistory, ({ one }) => ({
  subscription: one(subscription, {
    fields: [paymentHistory.subscriptionId],
    references: [subscription.id],
  }),
  userProfile: one(userProfile, {
    fields: [paymentHistory.userProfileId],
    references: [userProfile.id],
  }),
}));
