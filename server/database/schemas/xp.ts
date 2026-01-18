import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { userProfile } from "./users";

// XP transaction type enum
export const xpTransactionTypeEnum = pgEnum("xp_transaction_type", [
  "lesson_completed",
  "quiz_passed",
  "exercise_completed",
  "project_submitted",
  "project_approved",
  "course_completed",
  "streak_bonus",
  "badge_claimed",
  "daily_cap",
  "manual_adjustment",
]);

// XP transactions (history of all XP gains/losses)
export const xpTransaction = pgTable(
  "xp_transaction",
  {
    id: text("id").primaryKey(),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    type: xpTransactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(), // Can be negative for penalties
    reason: text("reason"),
    relatedEntityType: text("related_entity_type"), // lesson, quiz, exercise, project, badge
    relatedEntityId: text("related_entity_id"), // ID of the related entity
    metadata: text("metadata"), // JSON for additional data
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("xp_transaction_userProfileId_idx").on(table.userProfileId),
    index("xp_transaction_type_idx").on(table.type),
    index("xp_transaction_createdAt_idx").on(table.createdAt),
  ]
);

// Daily XP tracking (for free user cap enforcement)
export const dailyXp = pgTable(
  "daily_xp",
  {
    id: text("id").primaryKey(),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    totalXpEarned: integer("total_xp_earned").default(0).notNull(),
    cappedAt: integer("capped_at"), // The cap value if reached
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("daily_xp_userProfileId_idx").on(table.userProfileId),
    index("daily_xp_date_idx").on(table.date),
  ]
);

// XP levels configuration
export const xpLevel = pgTable("xp_level", {
  id: text("id").primaryKey(),
  level: integer("level").notNull().unique(),
  minXp: integer("min_xp").notNull(),
  maxXp: integer("max_xp"),
  title: text("title"), // e.g., "Novice", "Apprentice", "Expert"
  iconUrl: text("icon_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const xpTransactionRelations = relations(xpTransaction, ({ one }) => ({
  userProfile: one(userProfile, {
    fields: [xpTransaction.userProfileId],
    references: [userProfile.id],
  }),
}));

export const dailyXpRelations = relations(dailyXp, ({ one }) => ({
  userProfile: one(userProfile, {
    fields: [dailyXp.userProfileId],
    references: [userProfile.id],
  }),
}));
