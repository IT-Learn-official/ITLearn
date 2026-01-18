# IT Learn Platform - Database Schema Documentation

This document provides an overview of the IT Learn platform's database schema, role-based access control, and feature management system.

## Table of Contents

1. [User Roles & Permissions](#user-roles--permissions)
2. [Database Schema Overview](#database-schema-overview)
3. [Subscription Tiers](#subscription-tiers)
4. [Course Structure](#course-structure)
5. [Progress Tracking](#progress-tracking)
6. [XP & Gamification](#xp--gamification)
7. [Future Features](#future-features)

---

## User Roles & Permissions

### Role Types

The platform supports four user roles:

- **Student** (default)
- **Teacher**
- **Admin**
- **School Admin** (future feature)

### Role Permissions

#### Student (User)
- ✅ Create and manage account
- ✅ View and enroll in courses (based on subscription)
- ✅ View lessons and content
- ✅ Complete quizzes and exercises
- ✅ Submit projects (Pro/Lifetime only)
- ✅ Earn XP and badges
- ✅ View own progress
- ✅ Receive feedback on projects (Pro/Lifetime only)
- ✅ Public profile with username, badges, and level

#### Teacher
- ✅ All student permissions
- ✅ Create and manage courses
- ✅ Add/edit chapters, lessons, and exercises
- ✅ Review and provide feedback on projects
- ❌ No access to payments or platform settings

#### Admin (Founder)
- ✅ Full platform access
- ✅ Manage all users (change roles, ban/unban)
- ✅ Publish/unpublish courses
- ✅ Manage badges and XP rules
- ✅ View and manage subscriptions and payments
- ✅ Configure platform settings

#### School Admin (Future)
- ✅ Manage school information
- ✅ Create and manage classes
- ✅ Assign teachers to classes
- ✅ View student progress within their school

---

## Database Schema Overview

### Core Tables

#### Users & Authentication
- `user` - Base user authentication (from better-auth)
- `user_profile` - Extended user information with role, XP, level, streak
- `session`, `account`, `verification` - Authentication related tables

#### Subscriptions & Payments
- `subscription_plan` - Available subscription plans
- `subscription` - User subscriptions
- `payment_history` - Payment transaction history

#### Course Structure
- `course` - Course information
- `chapter` - Course chapters
- `lesson` - Individual lessons
- `lesson_content` - Modular lesson content blocks
- `course_prerequisite` - Course dependencies

#### Learning Activities
- `quiz`, `quiz_question`, `quiz_answer` - Quiz system
- `quiz_attempt`, `quiz_attempt_answer` - Quiz submissions
- `exercise`, `exercise_submission` - Code/practical exercises
- `project`, `project_submission`, `project_feedback` - Project-based learning

#### Progress & Gamification
- `course_progress`, `chapter_progress`, `lesson_progress` - Progress tracking
- `xp_transaction`, `daily_xp`, `xp_level` - XP system
- `badge`, `user_badge` - Achievement badges

#### School Management (Future)
- `school` - School information
- `school_admin` - School administrators
- `class` - Classes within schools
- `class_member` - Students in classes
- `teacher_assignment` - Teacher-class assignments

---

## Subscription Tiers

### Free Tier
**Price:** €0/month

**Features:**
- Limited course access (Free courses only)
- Basic lessons and quizzes
- XP tracking with daily soft cap
- Basic badges
- Community access via Discord

**Limitations:**
- ❌ No project submissions or feedback
- ❌ No advanced exercises
- ❌ Daily XP cap (soft limit)
- ❌ No certificates
- ❌ Limited to free courses only

### Pro Tier
**Price:** Variable (Monthly/Quarterly/Yearly)
- **Monthly:** €X/month
- **Quarterly:** €Y/3 months (save Z%)
- **Yearly:** €W/year (save V% - best value!)

**Features:**
- ✅ Access to ALL courses
- ✅ All exercises and projects
- ✅ Project feedback from teachers
- ✅ Unlimited XP earning
- ✅ All badges unlocked
- ✅ Course completion certificates
- ✅ Priority support
- ✅ Early access to new content

**Subscription Types:**
- `pro_monthly` - Billed monthly
- `pro_quarterly` - Billed every 3 months
- `pro_yearly` - Billed annually with discount

### Lifetime Tier
**Price:** One-time payment of €Z

**Features:**
- ✅ All Pro features
- ✅ Lifetime access (pay once, access forever)
- ✅ All future content included
- ✅ No recurring payments
- ✅ Best long-term value

### Stripe Integration

The subscription system is fully integrated with Stripe for payment processing:

**Features:**
- Automatic Stripe customer creation on signup
- Secure checkout with Stripe Checkout
- Subscription lifecycle management (create, update, cancel)
- Trial period support with abuse prevention
- Real-time webhook sync for subscription updates
- Customer portal for self-service subscription management
- Payment history tracking for invoicing

**Database Fields:**
- `subscription.stripeCustomerId` - Stripe Customer ID
- `subscription.stripeSubscriptionId` - Stripe Subscription ID
- `subscription.stripePriceId` - Current Stripe Price ID
- `subscription_plan.stripePriceId` - Stripe Price for the plan
- `subscription_plan.stripeProductId` - Stripe Product ID
- `payment_history.stripePaymentIntentId` - Payment Intent ID
- `payment_history.stripeInvoiceId` - Invoice ID

**Trial Abuse Prevention:**
Users can only claim one trial period per account across all plans. The system tracks `trialStart` and prevents subsequent trial claims.

For detailed Stripe integration guide, see [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md).

---

## Course Structure

Courses follow a hierarchical structure:

```
Course
└── Chapters
    └── Lessons
        ├── Content (text, video, code snippets)
        ├── Quizzes (multiple choice, true/false)
        ├── Exercises (code challenges, practical tasks)
        └── Projects (every 3-5 lessons, comprehensive)
```

### Course Properties

- **Access Types:** Free, Pro, Lifetime
- **Status:** Draft, Published, Archived
- **Versioning:** Courses can be updated while preserving progress
- **Prerequisites:** Courses can require completion of other courses

### Content Types

1. **Text Content** - Markdown/HTML formatted lessons
2. **Video Content** - Embedded video tutorials
3. **Code Snippets** - Syntax-highlighted code examples
4. **Mixed Content** - Combination of above

---

## Progress Tracking

### Three-Level Tracking

1. **Lesson Progress**
   - Status: Not Started, In Progress, Completed
   - XP earned
   - Time spent
   - Last accessed date

2. **Chapter Progress**
   - Aggregate of lesson completions
   - Progress percentage
   - Total XP earned in chapter

3. **Course Progress**
   - Overall course completion
   - Total lessons completed
   - Total XP earned
   - Course completion date

### Progress States

- `not_started` - User hasn't begun
- `in_progress` - User has started but not finished
- `completed` - User has finished all requirements

---

## XP & Gamification

### XP Sources

Users earn XP through various activities:

| Activity | Base XP | Notes |
|----------|---------|-------|
| Lesson Completed | 10-50 | Varies by lesson complexity |
| Quiz Passed | 20-100 | Based on quiz difficulty |
| Exercise Completed | 30-150 | Based on exercise difficulty |
| Project Submitted | 50-200 | Initial submission |
| Project Approved | 100-500 | After teacher review |
| Course Completed | 200-1000 | Bonus for finishing course |
| Streak Bonus | 10-50 | Daily login streak |
| Badge Claimed | 100 | When claiming earned badge |

### XP Caps

- **Free Users:** Soft daily cap (e.g., 500 XP/day)
- **Pro/Lifetime:** Unlimited XP earning

### Leveling System

- Users progress through levels based on total XP
- Each level has minimum and maximum XP thresholds
- Levels unlock titles and may unlock special badges
- Example levels: Novice, Apprentice, Developer, Expert, Master

### Badges

Badge categories include:
- **Course Completion** - Finish specific courses
- **Skill Mastery** - Complete all courses in a topic
- **Streak** - Maintain daily login streaks (3, 7, 30, 100 days)
- **XP Milestones** - Reach XP thresholds (1K, 10K, 100K)
- **Project Excellence** - High-quality project submissions
- **Community** - Helpful in Discord, contributions
- **Special** - Limited-time or founder badges

Users must **claim** badges to earn them and receive XP rewards.

---

## Future Features

### School Management System

Designed to support educational institutions:

1. **School Registration**
   - Schools can register on the platform
   - School admins manage their institution

2. **Class Management**
   - Create multiple classes per school
   - Generate unique join codes for students
   - Track academic year information

3. **Teacher Assignments**
   - Assign teachers to specific classes
   - Teachers can manage multiple classes
   - View student progress per class

4. **Student Enrollment**
   - Students can join via class code
   - OR have individual accounts
   - Progress visible to assigned teachers

5. **Bulk Subscriptions**
   - Schools can purchase subscriptions for students
   - Special school pricing tiers
   - Centralized billing

### Implementation Notes

- All tables are designed with future expansion in mind
- School-related fields are optional (nullable)
- Existing user accounts can be linked to schools later
- No breaking changes to current user flow

---

## Technical Implementation

### Database Technology
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Migrations:** Drizzle Kit

### API Layer
- **Framework:** tRPC
- **Authentication:** Better Auth
- **Validation:** Zod schemas

### Access Control

Role-based middleware protects routes:

```typescript
// Public - Anyone can access
publicProcedure

// Authenticated - Must be logged in
protectedProcedure

// User with profile - Authenticated + has profile
userProcedure

// Teachers and admins only
teacherProcedure

// Admins only
adminProcedure

// School admins and platform admins
schoolAdminProcedure
```

### Feature Flags

Subscription status determines feature access:

```typescript
const status = await subscriptions.getStatus();

if (status.isPro || status.isLifetime) {
  // Pro features enabled
}

if (status.type === 'free') {
  // Apply daily XP cap
  // Restrict course access
}
```

---

## Migration Path

### Current State → Future State

1. **Phase 1: Core Platform** ✅
   - User authentication
   - Basic course structure
   - Free tier available

2. **Phase 2: Subscriptions** (In Progress)
   - Payment integration
   - Pro/Lifetime tiers
   - Feature gating

3. **Phase 3: Enhanced Learning**
   - Full quiz system
   - Exercise code runner
   - Project feedback workflow

4. **Phase 4: Gamification**
   - Badge award logic
   - XP calculations
   - Leaderboards

5. **Phase 5: Schools** (Future)
   - School registration
   - Class management
   - Teacher dashboards
   - Bulk subscriptions

---

## Database Relationships

### Key Foreign Keys

- `user_profile.userId` → `user.id`
- `subscription.userProfileId` → `user_profile.id`
- `subscription.planId` → `subscription_plan.id`
- `chapter.courseId` → `course.id`
- `lesson.chapterId` → `chapter.id`
- `quiz.lessonId` → `lesson.id`
- `*_progress.userProfileId` → `user_profile.id`
- `user_badge.badgeId` → `badge.id`

### Cascade Deletes

- Deleting a user → Deletes all related data (sessions, subscriptions, progress)
- Deleting a course → Deletes chapters, lessons, progress
- Deleting a lesson → Deletes quizzes, exercises, progress

### Indexes

Performance-critical indexes on:
- User lookups: `userId`, `username`, `email`
- Course queries: `slug`, `status`, `accessType`
- Progress queries: `userProfileId + courseId/lessonId`
- Subscription status: `endDate`, `status`

---

## Security Considerations

1. **Role Verification:** All protected routes check user role
2. **Ownership Validation:** Users can only access their own data
3. **Subscription Checks:** Feature access validated on every request
4. **SQL Injection:** Drizzle ORM provides parameterized queries
5. **XSS Prevention:** Content sanitization on input
6. **Rate Limiting:** Better Auth rate limiting enabled

---

## Summary

This schema design provides:

✅ Comprehensive role-based access control
✅ Flexible subscription management
✅ Scalable course structure
✅ Detailed progress tracking
✅ Engaging gamification system
✅ Future-proof school management
✅ Clean separation of concerns
✅ Performance-optimized queries

The architecture supports the current MVP while allowing seamless expansion for future features.
