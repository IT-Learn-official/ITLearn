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
import { chapter } from "./chapters";
import { exercise } from "./exercises";
import { lessonProgress } from "./progress";
import { quiz } from "./quizzes";

// Lesson type enum
export const lessonTypeEnum = pgEnum("lesson_type", [
  "content", // Text, video, code snippets
  "quiz",
  "exercise",
  "project",
]);

// Content type enum
export const contentTypeEnum = pgEnum("content_type", [
  "text",
  "video",
  "code",
  "mixed",
]);

// Lessons table
export const lesson = pgTable(
  "lesson",
  {
    id: text("id").primaryKey(),
    chapterId: text("chapter_id")
      .notNull()
      .references(() => chapter.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    type: lessonTypeEnum("type").default("content").notNull(),
    contentType: contentTypeEnum("content_type"),
    displayOrder: integer("display_order").default(0).notNull(),
    xpReward: integer("xp_reward").default(10).notNull(),
    estimatedDurationMinutes: integer("estimated_duration_minutes"),
    isFree: boolean("is_free").default(false).notNull(), // Override course access
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("lesson_chapterId_idx").on(table.chapterId),
    index("lesson_type_idx").on(table.type),
    index("lesson_displayOrder_idx").on(table.displayOrder),
  ]
);

// Lesson content blocks (for modular content)
export const lessonContent = pgTable(
  "lesson_content",
  {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    type: contentTypeEnum("type").notNull(),
    content: text("content").notNull(), // Markdown, HTML, or JSON
    displayOrder: integer("display_order").default(0).notNull(),
    videoUrl: text("video_url"),
    videoDurationSeconds: integer("video_duration_seconds"),
    codeLanguage: text("code_language"),
    codeSnippet: text("code_snippet"),
    metadata: text("metadata"), // JSON for additional data
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("lesson_content_lessonId_idx").on(table.lessonId),
    index("lesson_content_displayOrder_idx").on(table.displayOrder),
  ]
);

// Relations
export const lessonRelations = relations(lesson, ({ one, many }) => ({
  chapter: one(chapter, {
    fields: [lesson.chapterId],
    references: [chapter.id],
  }),
  contentBlocks: many(lessonContent),
  progress: many(lessonProgress),
  quizzes: many(quiz),
  exercises: many(exercise),
}));

export const lessonContentRelations = relations(lessonContent, ({ one }) => ({
  lesson: one(lesson, {
    fields: [lessonContent.lessonId],
    references: [lesson.id],
  }),
}));
