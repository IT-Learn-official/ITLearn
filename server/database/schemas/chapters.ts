import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { course } from "./courses";
import { lesson } from "./lessons";
import { chapterProgress } from "./progress";

// Chapters table
export const chapter = pgTable(
  "chapter",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").default(0).notNull(),
    xpReward: integer("xp_reward").default(0).notNull(),
    estimatedDurationMinutes: integer("estimated_duration_minutes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("chapter_courseId_idx").on(table.courseId),
    index("chapter_displayOrder_idx").on(table.displayOrder),
  ]
);

// Relations
export const chapterRelations = relations(chapter, ({ one, many }) => ({
  course: one(course, {
    fields: [chapter.courseId],
    references: [course.id],
  }),
  lessons: many(lesson),
  progress: many(chapterProgress),
}));
