import { z } from "zod";
import { createTRPCRouter, userProcedure } from "../trpc";

export const progressRouter = createTRPCRouter({
  // Get course progress for a user
  getCourseProgress: userProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const progress = await ctx.db.courseProgress.findFirst({
        where: {
          userProfileId: ctx.userProfile.id,
          courseId: input.courseId,
        },
      });

      return progress;
    }),

  // Get all chapter progress for a course
  getChapterProgress: userProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const chapters = await ctx.db.chapter.findMany({
        where: { courseId: input.courseId },
      });

      const chapterIds = chapters.map((c) => c.id);

      const progress = await ctx.db.chapterProgress.findMany({
        where: {
          userProfileId: ctx.userProfile.id,
          chapterId: { in: chapterIds },
        },
      });

      return progress;
    }),

  // Get lesson progress
  getLessonProgress: userProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      const progress = await ctx.db.lessonProgress.findFirst({
        where: {
          userProfileId: ctx.userProfile.id,
          lessonId: input.lessonId,
        },
      });

      return progress;
    }),

  // Mark lesson as started
  startLesson: userProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.lessonProgress.findFirst({
        where: {
          userProfileId: ctx.userProfile.id,
          lessonId: input.lessonId,
        },
      });

      if (existing) {
        return existing;
      }

      const progress = await ctx.db.lessonProgress.create({
        data: {
          id: crypto.randomUUID(),
          userProfileId: ctx.userProfile.id,
          lessonId: input.lessonId,
          status: "in_progress",
          startedAt: new Date(),
          lastAccessedAt: new Date(),
        },
      });

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
      const existing = await ctx.db.lessonProgress.findFirst({
        where: {
          userProfileId: ctx.userProfile.id,
          lessonId: input.lessonId,
        },
      });

      if (existing) {
        const updated = await ctx.db.lessonProgress.update({
          where: { id: existing.id },
          data: {
            status: "completed",
            xpEarned: input.xpEarned,
            timeSpentSeconds:
              input.timeSpentSeconds ?? existing.timeSpentSeconds,
            completedAt: new Date(),
            lastAccessedAt: new Date(),
          },
        });

        return updated;
      }

      const progress = await ctx.db.lessonProgress.create({
        data: {
          id: crypto.randomUUID(),
          userProfileId: ctx.userProfile.id,
          lessonId: input.lessonId,
          status: "completed",
          xpEarned: input.xpEarned,
          timeSpentSeconds: input.timeSpentSeconds ?? 0,
          startedAt: new Date(),
          completedAt: new Date(),
          lastAccessedAt: new Date(),
        },
      });

      return progress;
    }),
});
