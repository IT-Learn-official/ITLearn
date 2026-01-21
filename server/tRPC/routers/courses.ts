import { TRPCError } from "@trpc/server";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { chapter } from "@/server/database/schemas/chapters";
import { course } from "@/server/database/schemas/courses";
import { lesson } from "@/server/database/schemas/lessons";
import {
  createTRPCRouter,
  publicProcedure,
  teacherProcedure,
  userProcedure,
} from "../trpc";

export const coursesRouter = createTRPCRouter({
  // Get all published courses
  getAll: publicProcedure
    .input(
      z
        .object({
          accessType: z.enum(["free", "pro", "lifetime"]).optional(),
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const conditions = [eq(course.status, "published")];

      if (input?.accessType) {
        conditions.push(eq(course.accessType, input.accessType));
      }

      const courses = await ctx.db.query.course.findMany({
        where: and(...conditions),
        limit: input?.limit ?? 50,
        offset: input?.offset ?? 0,
        orderBy: (course, { asc }) => [asc(course.displayOrder)],
      });

      return courses;
    }),

  // Get a single course by ID or slug
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!(input.id || input.slug)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either id or slug must be provided",
        });
      }

      const courseData = await ctx.db.query.course.findFirst({
        where: input.id
          ? eq(course.id, input.id)
          : eq(course.slug, input.slug ?? ""),
        with: {
          chapters: {
            orderBy: [asc(chapter.displayOrder)],
            with: {
              lessons: {
                orderBy: [asc(lesson.displayOrder)],
              },
            },
          },
        },
      });

      return courseData;
    }),

  // Create a new course (teachers and admins only)
  create: teacherProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        slug: z.string().min(1).max(255),
        description: z.string().optional(),
        shortDescription: z.string().max(500).optional(),
        imageUrl: z.url().optional(),
        thumbnailUrl: z.url().optional(),
        level: z.string().optional(),
        accessType: z.enum(["free", "pro", "lifetime"]).default("free"),
        estimatedDurationMinutes: z.number().int().positive().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newCourse = await ctx.db
        .insert(course)
        .values({
          ...input,
          id: crypto.randomUUID(),
          createdBy: ctx.userProfile.userId,
          status: "draft",
        })
        .returning();

      return newCourse[0];
    }),

  // Update course (teachers and admins only)
  update: teacherProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        shortDescription: z.string().max(500).optional(),
        imageUrl: z.string().url().optional(),
        thumbnailUrl: z.string().url().optional(),
        level: z.string().optional(),
        accessType: z.enum(["free", "pro", "lifetime"]).optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        estimatedDurationMinutes: z.number().int().positive().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;

      const [updatedCourse] = await ctx.db
        .update(course)
        .set(updates)
        .where(eq(course.id, id))
        .returning();

      return updatedCourse;
    }),

  // Get user's enrolled courses
  getMyCourses: userProcedure.query(async ({ ctx }) => {
    const enrolledCourses = await ctx.db.query.courseProgress.findMany({
      where: (courseProgress, { eq }) =>
        eq(courseProgress.userProfileId, ctx.userProfile.id),
      with: {
        course: true,
      },
    });

    return enrolledCourses;
  }),
});
