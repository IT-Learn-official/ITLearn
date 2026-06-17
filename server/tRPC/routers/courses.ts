import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
      const courses = await ctx.db.course.findMany({
        where: {
          status: "published",
          ...(input?.accessType ? { accessType: input.accessType } : {}),
        },
        limit: input?.limit ?? 50,
        offset: input?.offset ?? 0,
        orderBy: { displayOrder: "asc" },
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

      const courseData = await ctx.db.course.findFirst({
        where: input.id ? { id: input.id } : { slug: input.slug ?? "" },
        include: {
          chapters: {
            orderBy: { displayOrder: "asc" },
            include: {
              lessons: {
                orderBy: { displayOrder: "asc" },
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
      const newCourse = await ctx.db.course.create({
        data: {
          ...input,
          id: crypto.randomUUID(),
          createdBy: ctx.userProfile.userId,
          status: "draft",
        },
      });

      return newCourse;
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

      const updatedCourse = await ctx.db.course.update({
        where: { id },
        data: updates,
      });

      return updatedCourse;
    }),

  // Get user's enrolled courses
  getMyCourses: userProcedure.query(async ({ ctx }) => {
    const enrolledCourses = await ctx.db.courseProgress.findMany({
      where: { userProfileId: ctx.userProfile.id },
      include: {
        course: true,
      },
    });

    return enrolledCourses;
  }),
});
