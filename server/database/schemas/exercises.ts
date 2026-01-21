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

// Exercise type enum
export const exerciseTypeEnum = pgEnum("exercise_type", [
  "code",
  "practical",
  "written",
]);

// Exercise difficulty enum
export const exerciseDifficultyEnum = pgEnum("exercise_difficulty", [
  "easy",
  "medium",
  "hard",
]);

// Exercises table
export const exercise = pgTable(
  "exercise",
  {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    instructions: text("instructions").notNull(),
    type: exerciseTypeEnum("type").default("code").notNull(),
    difficulty: exerciseDifficultyEnum("difficulty")
      .default("medium")
      .notNull(),
    starterCode: text("starter_code"),
    solutionCode: text("solution_code"),
    testCases: text("test_cases"), // JSON array of test cases
    hints: text("hints").array(), // Array of hints
    maxAttempts: integer("max_attempts"), // null for unlimited
    timeLimit: integer("time_limit"), // in minutes, null for no limit
    isPro: boolean("is_pro").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("exercise_lessonId_idx").on(table.lessonId),
    index("exercise_type_idx").on(table.type),
    index("exercise_difficulty_idx").on(table.difficulty),
  ]
);

// Exercise submissions
export const exerciseSubmission = pgTable(
  "exercise_submission",
  {
    id: text("id").primaryKey(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercise.id, { onDelete: "cascade" }),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    isPassed: boolean("is_passed").default(false).notNull(),
    score: integer("score"), // Percentage
    testsPassed: integer("tests_passed").default(0).notNull(),
    totalTests: integer("total_tests").default(0).notNull(),
    executionTime: integer("execution_time"), // in milliseconds
    attemptNumber: integer("attempt_number").default(1).notNull(),
    feedback: text("feedback"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("exercise_submission_exerciseId_idx").on(table.exerciseId),
    index("exercise_submission_userProfileId_idx").on(table.userProfileId),
  ]
);

// Relations
export const exerciseRelations = relations(exercise, ({ one, many }) => ({
  lesson: one(lesson, {
    fields: [exercise.lessonId],
    references: [lesson.id],
  }),
  submissions: many(exerciseSubmission),
}));

export const exerciseSubmissionRelations = relations(
  exerciseSubmission,
  ({ one }) => ({
    exercise: one(exercise, {
      fields: [exerciseSubmission.exerciseId],
      references: [exercise.id],
    }),
    userProfile: one(userProfile, {
      fields: [exerciseSubmission.userProfileId],
      references: [userProfile.id],
    }),
  })
);
