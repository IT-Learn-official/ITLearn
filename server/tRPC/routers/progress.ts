import { eq } from "drizzle-orm";
import { z } from "zod";
import { lessonProgress } from "@/server/database/schemas/progress";
import { createTRPCRouter, userProcedure } from "../trpc";

export const progressRouter = createTRPCRouter({
  // Get course progress for a user
  getCourseProgress: userProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const progress = await ctx.db.query.courseProgress.findFirst({
        where: (cp, { and, eq }) =>
          and(
            eq(cp.userProfileId, ctx.userProfile.id),
            eq(cp.courseId, input.courseId)
          ),
      });

      return progress;
    }),

  // Get all chapter progress for a course
  getChapterProgress: userProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chapters = await ctx.db.query.chapter.findMany({
        where: (chapter, { eq }) => eq(chapter.courseId, input.courseId),
      });

      const chapterIds = chapters.map((c) => c.id);

      const progress = await ctx.db.query.chapterProgress.findMany({
        where: (cp, { and, eq, inArray }) =>
          and(
            eq(cp.userProfileId, ctx.userProfile.id),
            inArray(cp.chapterId, chapterIds)
          ),
      });

      return progress;
    }),

  // Get lesson progress
  getLessonProgress: userProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      const progress = await ctx.db.query.lessonProgress.findFirst({
        where: (lp, { and, eq }) =>
          and(
            eq(lp.userProfileId, ctx.userProfile.id),
            eq(lp.lessonId, input.lessonId)
          ),
      });

      return progress;
    }),

  // Mark lesson as started
  startLesson: userProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.lessonProgress.findFirst({
        where: (lp, { and, eq }) =>
          and(
            eq(lp.userProfileId, ctx.userProfile.id),
            eq(lp.lessonId, input.lessonId)
          ),
      });

      if (existing) {
        return existing;
      }

      const [progress] = await ctx.db
        .insert(lessonProgress)
        .values({
          id: crypto.randomUUID(),
          userProfileId: ctx.userProfile.id,
          lessonId: input.lessonId,
          status: "in_progress",
          startedAt: new Date(),
          lastAccessedAt: new Date(),
        })
        .returning();

      return progress;
    }),

  // Mark lesson as completed
  completeLesson: userProcedure
    .input(
      z.object({
        lessonId: z.string(),
        xpEarned: z.number().int().min(0),
        timeSpentSeconds: z.number().int().min(0).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.lessonProgress.findFirst({
        where: (lp, { and, eq }) =>
          and(
            eq(lp.userProfileId, ctx.userProfile.id),
            eq(lp.lessonId, input.lessonId)
          ),
      });

      if (existing) {
        const [updated] = await ctx.db
          .update(lessonProgress)
          .set({
            status: "completed",
            xpEarned: input.xpEarned,
            timeSpentSeconds:
              input.timeSpentSeconds ?? existing.timeSpentSeconds,
            completedAt: new Date(),
            lastAccessedAt: new Date(),
          })
          .where(eq(lessonProgress.id, existing.id))
          .returning();

        return updated;
      }

      const [progress] = await ctx.db
        .insert(lessonProgress)
        .values({
          id: crypto.randomUUID(),
          userProfileId: ctx.userProfile.id,
          lessonId: input.lessonId,
          status: "completed",
          xpEarned: input.xpEarned,
          timeSpentSeconds: input.timeSpentSeconds ?? 0,
          startedAt: new Date(),
          completedAt: new Date(),
          lastAccessedAt: new Date(),
        })
        .returning();

      return progress;
    }),
});
