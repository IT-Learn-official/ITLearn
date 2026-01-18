import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { userProfile } from "./users";

// Badge category enum
export const badgeCategoryEnum = pgEnum("badge_category", [
  "course_completion",
  "skill_mastery",
  "streak",
  "xp_milestone",
  "project_excellence",
  "community",
  "special",
]);

// Badges table (available badges in the system)
export const badge = pgTable("badge", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: badgeCategoryEnum("category").notNull(),
  iconUrl: text("icon_url").notNull(),
  criteria: text("criteria"), // JSON describing how to earn it
  xpReward: integer("xp_reward").default(100).notNull(),
  rarity: text("rarity"), // common, rare, epic, legendary
  displayOrder: integer("display_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// User badges (badges earned by users)
export const userBadge = pgTable(
  "user_badge",
  {
    id: text("id").primaryKey(),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    badgeId: text("badge_id")
      .notNull()
      .references(() => badge.id, { onDelete: "cascade" }),
    earnedAt: timestamp("earned_at").notNull(),
    claimedAt: timestamp("claimed_at"), // When user actually claimed the badge
    isDisplayed: boolean("is_displayed").default(true).notNull(), // Show on profile
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("user_badge_userProfileId_idx").on(table.userProfileId),
    index("user_badge_badgeId_idx").on(table.badgeId),
    index("user_badge_earnedAt_idx").on(table.earnedAt),
  ]
);

// Relations
export const badgeRelations = relations(badge, ({ many }) => ({
  userBadges: many(userBadge),
}));

export const userBadgeRelations = relations(userBadge, ({ one }) => ({
  userProfile: one(userProfile, {
    fields: [userBadge.userProfileId],
    references: [userProfile.id],
  }),
  badge: one(badge, {
    fields: [userBadge.badgeId],
    references: [badge.id],
  }),
}));
