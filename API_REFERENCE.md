# IT Learn API - Quick Reference Guide

Quick reference for using the IT Learn tRPC API with role-based access control.

## Available Routers

- `health` - System health checks
- `account` - User account management
- `admin` - Admin operations
- `courses` - Course management
- `progress` - Learning progress tracking
- `badges` - Achievement badges
- `subscriptions` - Subscription management

## Authentication

All authenticated routes require a valid session. Use Better Auth to authenticate users.

```typescript
import { auth } from "@/lib/auth";

// Get current session
const session = await auth.api.getSession({ headers: request.headers });
```

## Role-Based Access

### Public Procedures
No authentication required.

```typescript
trpc.health.check.query();
trpc.courses.getAll.query();
```

### Protected Procedures
Requires authentication.

```typescript
// User must be logged in
trpc.account.update.mutate({ ... });
```

### User Procedures
Requires authentication + user profile.

```typescript
// User must have a profile
trpc.progress.getCourseProgress.query({ courseId: "..." });
trpc.badges.getMyBadges.query();
```

### Teacher Procedures
Requires `teacher` or `admin` role.

```typescript
// Create a course (teachers and admins)
trpc.courses.create.mutate({
  title: "Introduction to TypeScript",
  slug: "intro-to-typescript",
  accessType: "free",
});
```

### Admin Procedures
Requires `admin` role only.

```typescript
// Manage subscriptions (admins only)
trpc.subscriptions.create.mutate({ ... });
```

## Courses Router

### Get All Courses
```typescript
const courses = await trpc.courses.getAll.query({
  accessType: "free", // optional: "free" | "pro" | "lifetime"
  limit: 20,
  offset: 0,
});
```

### Get Single Course
```typescript
// By ID
const course = await trpc.courses.getById.query({
  id: "course-uuid",
});

// By slug
const course = await trpc.courses.getById.query({
  slug: "intro-to-typescript",
});
```

### Create Course (Teacher/Admin)
```typescript
const newCourse = await trpc.courses.create.mutate({
  title: "Advanced React Patterns",
  slug: "advanced-react-patterns",
  description: "Learn advanced React patterns...",
  accessType: "pro",
  level: "advanced",
  tags: ["react", "javascript", "frontend"],
});
```

### Update Course (Teacher/Admin)
```typescript
const updated = await trpc.courses.update.mutate({
  id: "course-uuid",
  title: "Updated Title",
  status: "published",
});
```

### Get My Enrolled Courses
```typescript
const myCourses = await trpc.courses.getMyCourses.query();
```

## Progress Router

### Get Course Progress
```typescript
const progress = await trpc.progress.getCourseProgress.query({
  courseId: "course-uuid",
});
```

### Get Chapter Progress
```typescript
const chapters = await trpc.progress.getChapterProgress.query({
  courseId: "course-uuid",
});
```

### Get Lesson Progress
```typescript
const lesson = await trpc.progress.getLessonProgress.query({
  lessonId: "lesson-uuid",
});
```

### Start Lesson
```typescript
const started = await trpc.progress.startLesson.mutate({
  lessonId: "lesson-uuid",
});
```

### Complete Lesson
```typescript
const completed = await trpc.progress.completeLesson.mutate({
  lessonId: "lesson-uuid",
  xpEarned: 50,
  timeSpentSeconds: 600,
});
```

## Badges Router

### Get All Available Badges
```typescript
const allBadges = await trpc.badges.getAll.query();
```

### Get My Badges
```typescript
const myBadges = await trpc.badges.getMyBadges.query();
```

### Claim Badge
```typescript
const claimed = await trpc.badges.claim.mutate({
  badgeId: "badge-uuid",
});
```

### Toggle Badge Display
```typescript
const updated = await trpc.badges.toggleDisplay.mutate({
  userBadgeId: "user-badge-uuid",
  isDisplayed: true,
});
```

## Subscriptions Router

### Get Available Plans
```typescript
const plans = await trpc.subscriptions.getPlans.query();
```

### Get My Subscription
```typescript
const mySubscription = await trpc.subscriptions.getMy.query();
```

### Get Subscription Status
```typescript
const status = await trpc.subscriptions.getStatus.query();

// Returns:
// {
//   type: "free" | "pro_monthly" | "pro_quarterly" | "pro_yearly" | "lifetime",
//   isActive: boolean,
//   isPro: boolean,
//   isLifetime: boolean,
//   endDate: Date | null,
// }
```

### Get Payment History
```typescript
const payments = await trpc.subscriptions.getPaymentHistory.query();
```

### Cancel Subscription
```typescript
const cancelled = await trpc.subscriptions.cancel.mutate({
  reason: "Too expensive",
});
```

## Feature Gating Examples

### Check if User Can Access Content
```typescript
const status = await trpc.subscriptions.getStatus.query();

// For Pro-only courses
if (!status.isPro && !status.isLifetime && course.accessType === "pro") {
  // Show upgrade prompt
  return <UpgradeToProModal />;
}

// For Lifetime-only features
if (!status.isLifetime && feature.requiresLifetime) {
  // Show lifetime upgrade
  return <UpgradeToLifetimeModal />;
}
```

### Check Daily XP Cap (Free Users)
```typescript
const status = await trpc.subscriptions.getStatus.query();

if (status.type === "free") {
  // Apply daily XP cap logic
  const dailyXp = await getDailyXpEarned();
  if (dailyXp >= 500) {
    return <DailyCapReached />;
  }
}
```

## Error Handling

```typescript
import { TRPCClientError } from "@trpc/client";

try {
  await trpc.courses.create.mutate({ ... });
} catch (error) {
  if (error instanceof TRPCClientError) {
    switch (error.data?.code) {
      case "UNAUTHORIZED":
        // User not logged in
        redirectToLogin();
        break;
      case "FORBIDDEN":
        // User doesn't have permission
        showErrorToast("You don't have permission");
        break;
      case "NOT_FOUND":
        // Resource not found
        showErrorToast("Course not found");
        break;
      default:
        showErrorToast(error.message);
    }
  }
}
```

## Common Patterns

### Loading States
```typescript
import { trpc } from "@/lib/trpc";

function MyCourses() {
  const { data: courses, isLoading } = trpc.courses.getMyCourses.useQuery();

  if (isLoading) return <Spinner />;
  
  return <CourseList courses={courses} />;
}
```

### Mutations with Optimistic Updates
```typescript
const utils = trpc.useContext();

const completeLessonMutation = trpc.progress.completeLesson.useMutation({
  onMutate: async (newProgress) => {
    // Optimistically update UI
    await utils.progress.getLessonProgress.cancel();
    const previous = utils.progress.getLessonProgress.getData();
    
    utils.progress.getLessonProgress.setData(
      { lessonId: newProgress.lessonId },
      (old) => ({ ...old, status: "completed" })
    );
    
    return { previous };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    utils.progress.getLessonProgress.setData(
      { lessonId: variables.lessonId },
      context?.previous
    );
  },
  onSettled: () => {
    // Refetch after mutation
    utils.progress.getLessonProgress.invalidate();
  },
});
```

## Environment Setup

Ensure these environment variables are set:

```env
# Database
DATABASE_URL=postgresql://...

# Better Auth
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=...

# OAuth Providers (optional)
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Database Migrations

### Generate Migration
```bash
npm run db:generate
```

### Apply Migration
```bash
npm run db:migrate
```

### View Database
```bash
npm run db:studio
```

## TypeScript Types

All tRPC procedures are fully typed. Import types from the app router:

```typescript
import type { AppRouter } from "@/server/tRPC/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

// Use specific types
type CourseInput = RouterInput["courses"]["create"];
type CourseOutput = RouterOutput["courses"]["getAll"];
```

## Best Practices

1. **Always check subscription status** before showing Pro/Lifetime content
2. **Use optimistic updates** for better UX on mutations
3. **Handle errors gracefully** with proper error messages
4. **Invalidate queries** after mutations to keep data fresh
5. **Use role-based procedures** instead of checking roles manually
6. **Paginate large lists** using limit/offset
7. **Cache subscription status** to avoid repeated calls

## Next Steps

- Read the full [Database Schema Documentation](./DATABASE_SCHEMA.md)
- Review the [tRPC Documentation](https://trpc.io)
- Check the [Better Auth Documentation](https://better-auth.com)
