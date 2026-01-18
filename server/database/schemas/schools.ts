import { relations } from "drizzle-orm";
import { boolean, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userProfile } from "./users";

// Schools table (for future school/class management)
export const school = pgTable("school", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// School admins (relationship table)
export const schoolAdmin = pgTable(
  "school_admin",
  {
    id: text("id").primaryKey(),
    schoolId: text("school_id")
      .notNull()
      .references(() => school.id, { onDelete: "cascade" }),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("school_admin_schoolId_idx").on(table.schoolId),
    index("school_admin_userProfileId_idx").on(table.userProfileId),
  ]
);

// Classes table
export const classRoom = pgTable(
  "class",
  {
    id: text("id").primaryKey(),
    schoolId: text("school_id")
      .notNull()
      .references(() => school.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    code: text("code").unique(), // Unique class code for joining
    description: text("description"),
    academicYear: text("academic_year"), // e.g., "2024-2025"
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("class_schoolId_idx").on(table.schoolId),
    index("class_code_idx").on(table.code),
  ]
);

// Class members (students in classes)
export const classMember = pgTable(
  "class_member",
  {
    id: text("id").primaryKey(),
    classId: text("class_id")
      .notNull()
      .references(() => classRoom.id, { onDelete: "cascade" }),
    userProfileId: text("user_profile_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("class_member_classId_idx").on(table.classId),
    index("class_member_userProfileId_idx").on(table.userProfileId),
  ]
);

// Teacher assignments (teachers assigned to classes/courses)
export const teacherAssignment = pgTable(
  "teacher_assignment",
  {
    id: text("id").primaryKey(),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => userProfile.id, { onDelete: "cascade" }),
    classId: text("class_id").references(() => classRoom.id, {
      onDelete: "cascade",
    }),
    schoolId: text("school_id").references(() => school.id, {
      onDelete: "cascade",
    }),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    unassignedAt: timestamp("unassigned_at"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("teacher_assignment_teacherId_idx").on(table.teacherId),
    index("teacher_assignment_classId_idx").on(table.classId),
    index("teacher_assignment_schoolId_idx").on(table.schoolId),
  ]
);

// Relations
export const schoolRelations = relations(school, ({ many }) => ({
  classes: many(classRoom),
  admins: many(schoolAdmin),
  teacherAssignments: many(teacherAssignment),
}));

export const schoolAdminRelations = relations(schoolAdmin, ({ one }) => ({
  school: one(school, {
    fields: [schoolAdmin.schoolId],
    references: [school.id],
  }),
  userProfile: one(userProfile, {
    fields: [schoolAdmin.userProfileId],
    references: [userProfile.id],
  }),
}));

export const classRoomRelations = relations(classRoom, ({ one, many }) => ({
  school: one(school, {
    fields: [classRoom.schoolId],
    references: [school.id],
  }),
  members: many(classMember),
  teacherAssignments: many(teacherAssignment),
}));

export const classMemberRelations = relations(classMember, ({ one }) => ({
  class: one(classRoom, {
    fields: [classMember.classId],
    references: [classRoom.id],
  }),
  userProfile: one(userProfile, {
    fields: [classMember.userProfileId],
    references: [userProfile.id],
  }),
}));

export const teacherAssignmentRelations = relations(
  teacherAssignment,
  ({ one }) => ({
    teacher: one(userProfile, {
      fields: [teacherAssignment.teacherId],
      references: [userProfile.id],
    }),
    class: one(classRoom, {
      fields: [teacherAssignment.classId],
      references: [classRoom.id],
    }),
    school: one(school, {
      fields: [teacherAssignment.schoolId],
      references: [school.id],
    }),
  })
);
