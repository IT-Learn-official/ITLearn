import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { chapter } from "./chapters";
import { course } from "./courses";
import { lesson } from "./lessons";
import { userProfile } from "./users";

// Progress status enum
export const progressStatusEnum = pgEnum("progress_status", [
  "not_started",
  "in_progress",
  "completed",
]);

// Course progress
export const courseProgress = pgTable(
  "course_progress",
  {
    id: text("id").primaryKey(),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    status: progressStatusEnum("status").default("not_started").notNull(),
    progressPercentage: integer("progress_percentage").default(0).notNull(),
    totalXpEarned: integer("total_xp_earned").default(0).notNull(),
    lessonsCompleted: integer("lessons_completed").default(0).notNull(),
    totalLessons: integer("total_lessons").default(0).notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    lastAccessedAt: timestamp("last_accessed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("course_progress_userProfileId_idx").on(table.userProfileId),
    index("course_progress_courseId_idx").on(table.courseId),
    index("course_progress_status_idx").on(table.status),
  ]
);

// Chapter progress
export const chapterProgress = pgTable(
  "chapter_progress",
  {
    id: text("id").primaryKey(),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => chapter.id, { onDelete: "cascade" }),
    status: progressStatusEnum("status").default("not_started").notNull(),
    progressPercentage: integer("progress_percentage").default(0).notNull(),
    xpEarned: integer("xp_earned").default(0).notNull(),
    lessonsCompleted: integer("lessons_completed").default(0).notNull(),
    totalLessons: integer("total_lessons").default(0).notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    lastAccessedAt: timestamp("last_accessed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("chapter_progress_userProfileId_idx").on(table.userProfileId),
    index("chapter_progress_chapterId_idx").on(table.chapterId),
    index("chapter_progress_status_idx").on(table.status),
  ]
);

// Lesson progress
export const lessonProgress = pgTable(
  "lesson_progress",
  {
    id: text("id").primaryKey(),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    status: progressStatusEnum("status").default("not_started").notNull(),
    xpEarned: integer("xp_earned").default(0).notNull(),
    timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
    startedAt: timestamp("started_at"),
    completedAt: timestamp("completed_at"),
    lastAccessedAt: timestamp("last_accessed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("lesson_progress_userProfileId_idx").on(table.userProfileId),
    index("lesson_progress_lessonId_idx").on(table.lessonId),
    index("lesson_progress_status_idx").on(table.status),
  ]
);

// Relations
export const courseProgressRelations = relations(courseProgress, ({ one }) => ({
  userProfile: one(userProfile, {
    fields: [courseProgress.userProfileId],
    references: [userProfile.id],
  }),
  course: one(course, {
    fields: [courseProgress.courseId],
    references: [course.id],
  }),
}));

export const chapterProgressRelations = relations(
  chapterProgress,
  ({ one }) => ({
    userProfile: one(userProfile, {
      fields: [chapterProgress.userProfileId],
      references: [userProfile.id],
    }),
    chapter: one(chapter, {
      fields: [chapterProgress.chapterId],
      references: [chapter.id],
    }),
  })
);

export const lessonProgressRelations = relations(lessonProgress, ({ one }) => ({
  userProfile: one(userProfile, {
    fields: [lessonProgress.userProfileId],
    references: [userProfile.id],
  }),
  lesson: one(lesson, {
    fields: [lessonProgress.lessonId],
    references: [lesson.id],
  }),
}));
