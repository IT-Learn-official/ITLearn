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
import { lesson } from "./lessons";
import { userProfile } from "./users";

// Project status enum
export const projectStatusEnum = pgEnum("project_status", [
  "draft",
  "submitted",
  "under_review",
  "approved",
  "needs_revision",
]);

// Projects table (project-based lessons)
export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    objectives: text("objectives").array().notNull(),
    requirements: text("requirements").array().notNull(),
    resources: text("resources").array(), // Links to helpful resources
    starterCode: text("starter_code"),
    rubric: text("rubric"), // JSON for grading criteria
    estimatedHours: integer("estimated_hours"),
    isPro: boolean("is_pro").default(true).notNull(), // Projects usually for Pro
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("project_lessonId_idx").on(table.lessonId),
    index("project_displayOrder_idx").on(table.displayOrder),
  ]
);

// Project submissions
export const projectSubmission = pgTable(
  "project_submission",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    repositoryUrl: text("repository_url"),
    liveUrl: text("live_url"),
    screenshotUrls: text("screenshot_urls").array(),
    notes: text("notes"),
    status: projectStatusEnum("status").default("draft").notNull(),
    score: integer("score"), // Out of 100
    submittedAt: timestamp("submitted_at"),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("project_submission_projectId_idx").on(table.projectId),
    index("project_submission_userProfileId_idx").on(table.userProfileId),
    index("project_submission_status_idx").on(table.status),
  ]
);

// Project feedback from teachers
export const projectFeedback = pgTable(
  "project_feedback",
  {
    id: text("id").primaryKey(),
    submissionId: text("submission_id")
      .notNull()
      .unique()
      .references(() => projectSubmission.id, { onDelete: "cascade" }),
    teacherId: text("teacher_id").notNull(), // userProfileId of teacher
    status: projectStatusEnum("status").default("under_review").notNull(),
    overallFeedback: text("overall_feedback").notNull(),
    strengths: text("strengths").array(),
    improvements: text("improvements").array(),
    score: integer("score").notNull(), // Out of 100
    rubricScores: text("rubric_scores"), // JSON mapping rubric items to scores
    isPublic: boolean("is_public").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("project_feedback_submissionId_idx").on(table.submissionId),
    index("project_feedback_teacherId_idx").on(table.teacherId),
  ]
);

// Relations
export const projectRelations = relations(project, ({ one, many }) => ({
  lesson: one(lesson, {
    fields: [project.lessonId],
    references: [lesson.id],
  }),
  submissions: many(projectSubmission),
}));

export const projectSubmissionRelations = relations(
  projectSubmission,
  ({ one }) => ({
    project: one(project, {
      fields: [projectSubmission.projectId],
      references: [project.id],
    }),
    userProfile: one(userProfile, {
      fields: [projectSubmission.userProfileId],
      references: [userProfile.id],
    }),
    feedback: one(projectFeedback),
  })
);

export const projectFeedbackRelations = relations(
  projectFeedback,
  ({ one }) => ({
    submission: one(projectSubmission, {
      fields: [projectFeedback.submissionId],
      references: [projectSubmission.id],
    }),
  })
);
