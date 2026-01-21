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
import { user as authUser } from "./auth";
import { userBadge } from "./badges";
import { chapterProgress, courseProgress, lessonProgress } from "./progress";
import { projectSubmission } from "./projects";
import { classMember } from "./schools";
import { subscription } from "./subscriptions";
import { xpTransaction } from "./xp";

// User roles enum
export const userRoleEnum = pgEnum("user_role", [
  "student",
  "teacher",
  "admin",
  "school_admin",
]);

// Extended user profile information
export const userProfile = pgTable(
  "user_profile",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => authUser.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").default("student").notNull(),
    username: text("username").unique(),
    bio: text("bio"),
    totalXp: integer("total_xp").default(0).notNull(),
    currentLevel: integer("current_level").default(1).notNull(),
    streakDays: integer("streak_days").default(0).notNull(),
    lastActivityDate: timestamp("last_activity_date"),
    isActive: boolean("is_active").default(true).notNull(),
    isBanned: boolean("is_banned").default(false).notNull(),
    bannedAt: timestamp("banned_at"),
    bannedReason: text("banned_reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("user_profile_userId_idx").on(table.userId),
    index("user_profile_role_idx").on(table.role),
    index("user_profile_username_idx").on(table.username),
  ]
);

export const userProfileRelations = relations(userProfile, ({ one, many }) => ({
  user: one(authUser, {
    fields: [userProfile.userId],
    references: [authUser.id],
  }),
  subscription: one(subscription),
  badges: many(userBadge),
  courseProgress: many(courseProgress),
  chapterProgress: many(chapterProgress),
  lessonProgress: many(lessonProgress),
  xpTransactions: many(xpTransaction),
  projectSubmissions: many(projectSubmission),
  classMemberships: many(classMember),
}));
