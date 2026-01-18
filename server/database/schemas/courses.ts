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
import { courseProgress } from "./progress";

// Course access type enum
export const courseAccessEnum = pgEnum("course_access", [
  "free",
  "pro",
  "lifetime",
]);

// Course status enum
export const courseStatusEnum = pgEnum("course_status", [
  "draft",
  "published",
  "archived",
]);

// Courses table
export const course = pgTable(
  "course",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    shortDescription: text("short_description"),
    imageUrl: text("image_url"),
    thumbnailUrl: text("thumbnail_url"),
    level: text("level"), // beginner, intermediate, advanced
    accessType: courseAccessEnum("access_type").default("free").notNull(),
    status: courseStatusEnum("status").default("draft").notNull(),
    version: integer("version").default(1).notNull(),
    previousVersionId: text("previous_version_id"),
    estimatedDurationMinutes: integer("estimated_duration_minutes"),
    totalXpReward: integer("total_xp_reward").default(0).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    tags: text("tags").array(), // Array of tags
    createdBy: text("created_by").notNull(), // userId of teacher who created it
    publishedAt: timestamp("published_at"),
    archivedAt: timestamp("archived_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("course_slug_idx").on(table.slug),
    index("course_status_idx").on(table.status),
    index("course_accessType_idx").on(table.accessType),
    index("course_createdBy_idx").on(table.createdBy),
    index("course_publishedAt_idx").on(table.publishedAt),
  ]
);

// Course prerequisites (course can depend on other courses)
export const coursePrerequisite = pgTable(
  "course_prerequisite",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    prerequisiteCourseId: text("prerequisite_course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    isRequired: boolean("is_required").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("course_prerequisite_courseId_idx").on(table.courseId),
    index("course_prerequisite_prerequisiteCourseId_idx").on(
      table.prerequisiteCourseId
    ),
  ]
);

// Relations
export const courseRelations = relations(course, ({ one, many }) => ({
  chapters: many(chapter),
  progress: many(courseProgress),
  prerequisites: many(coursePrerequisite, {
    relationName: "course_prerequisites",
  }),
  requiredBy: many(coursePrerequisite, {
    relationName: "course_required_by",
  }),
  previousVersion: one(course, {
    fields: [course.previousVersionId],
    references: [course.id],
    relationName: "course_versions",
  }),
  nextVersions: many(course, {
    relationName: "course_versions",
  }),
}));

export const coursePrerequisiteRelations = relations(
  coursePrerequisite,
  ({ one }) => ({
    course: one(course, {
      fields: [coursePrerequisite.courseId],
      references: [course.id],
      relationName: "course_prerequisites",
    }),
    prerequisiteCourse: one(course, {
      fields: [coursePrerequisite.prerequisiteCourseId],
      references: [course.id],
      relationName: "course_required_by",
    }),
  })
);
