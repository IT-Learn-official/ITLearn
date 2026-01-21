import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { lesson } from "./lessons";
import { userProfile } from "./users";

// Quizzes table
export const quiz = pgTable(
  "quiz",
  {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    passingScore: integer("passing_score").default(70).notNull(), // Percentage
    timeLimit: integer("time_limit"), // in seconds, null for no limit
    maxAttempts: integer("max_attempts"), // null for unlimited
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("quiz_lessonId_idx").on(table.lessonId),
    index("quiz_displayOrder_idx").on(table.displayOrder),
  ]
);

// Quiz questions table
export const quizQuestion = pgTable(
  "quiz_question",
  {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    explanation: text("explanation"), // Shown after answering
    type: text("type").notNull(), // multiple_choice, true_false, multiple_select
    points: integer("points").default(1).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("quiz_question_quizId_idx").on(table.quizId),
    index("quiz_question_displayOrder_idx").on(table.displayOrder),
  ]
);

// Quiz answer options table
export const quizAnswer = pgTable(
  "quiz_answer",
  {
    id: text("id").primaryKey(),
    questionId: text("question_id")
      .notNull()
      .references(() => quizQuestion.id, { onDelete: "cascade" }),
    answerText: text("answer_text").notNull(),
    isCorrect: boolean("is_correct").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("quiz_answer_questionId_idx").on(table.questionId),
    index("quiz_answer_displayOrder_idx").on(table.displayOrder),
  ]
);

// Quiz attempts (user submissions)
export const quizAttempt = pgTable(
  "quiz_attempt",
  {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    score: integer("score").notNull(), // Percentage
    isPassed: boolean("is_passed").default(false).notNull(),
    attemptNumber: integer("attempt_number").default(1).notNull(),
    timeSpentSeconds: integer("time_spent_seconds"),
    startedAt: timestamp("started_at").notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("quiz_attempt_quizId_idx").on(table.quizId),
    index("quiz_attempt_userProfileId_idx").on(table.userProfileId),
  ]
);

// User answers for quiz attempts
export const quizAttemptAnswer = pgTable(
  "quiz_attempt_answer",
  {
    id: text("id").primaryKey(),
    attemptId: text("attempt_id")
      .notNull()
      .references(() => quizAttempt.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => quizQuestion.id),
    selectedAnswerIds: text("selected_answer_ids").array().notNull(), // Array of answer IDs
    isCorrect: boolean("is_correct").default(false).notNull(),
    pointsEarned: integer("points_earned").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("quiz_attempt_answer_attemptId_idx").on(table.attemptId),
    index("quiz_attempt_answer_questionId_idx").on(table.questionId),
  ]
);

// Relations
export const quizRelations = relations(quiz, ({ one, many }) => ({
  lesson: one(lesson, {
    fields: [quiz.lessonId],
    references: [lesson.id],
  }),
  questions: many(quizQuestion),
  attempts: many(quizAttempt),
}));

export const quizQuestionRelations = relations(
  quizQuestion,
  ({ one, many }) => ({
    quiz: one(quiz, {
      fields: [quizQuestion.quizId],
      references: [quiz.id],
    }),
    answers: many(quizAnswer),
    attemptAnswers: many(quizAttemptAnswer),
  })
);

export const quizAnswerRelations = relations(quizAnswer, ({ one }) => ({
  question: one(quizQuestion, {
    fields: [quizAnswer.questionId],
    references: [quizQuestion.id],
  }),
}));

export const quizAttemptRelations = relations(quizAttempt, ({ one, many }) => ({
  quiz: one(quiz, {
    fields: [quizAttempt.quizId],
    references: [quiz.id],
  }),
  userProfile: one(userProfile, {
    fields: [quizAttempt.userProfileId],
    references: [userProfile.id],
  }),
  answers: many(quizAttemptAnswer),
}));

export const quizAttemptAnswerRelations = relations(
  quizAttemptAnswer,
  ({ one }) => ({
    attempt: one(quizAttempt, {
      fields: [quizAttemptAnswer.attemptId],
      references: [quizAttempt.id],
    }),
    question: one(quizQuestion, {
      fields: [quizAttemptAnswer.questionId],
      references: [quizQuestion.id],
    }),
  })
);
