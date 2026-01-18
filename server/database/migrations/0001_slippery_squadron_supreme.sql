CREATE TYPE "public"."badge_category" AS ENUM('course_completion', 'skill_mastery', 'streak', 'xp_milestone', 'project_excellence', 'community', 'special');--> statement-breakpoint
CREATE TYPE "public"."course_access" AS ENUM('free', 'pro', 'lifetime');--> statement-breakpoint
CREATE TYPE "public"."course_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."exercise_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."exercise_type" AS ENUM('code', 'practical', 'written');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('text', 'video', 'code', 'mixed');--> statement-breakpoint
CREATE TYPE "public"."lesson_type" AS ENUM('content', 'quiz', 'exercise', 'project');--> statement-breakpoint
CREATE TYPE "public"."progress_status" AS ENUM('not_started', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'submitted', 'under_review', 'approved', 'needs_revision');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired', 'pending');--> statement-breakpoint
CREATE TYPE "public"."subscription_type" AS ENUM('free', 'pro_monthly', 'pro_quarterly', 'pro_yearly', 'lifetime');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'teacher', 'admin', 'school_admin');--> statement-breakpoint
CREATE TYPE "public"."xp_transaction_type" AS ENUM('lesson_completed', 'quiz_passed', 'exercise_completed', 'project_submitted', 'project_approved', 'course_completed', 'streak_bonus', 'badge_claimed', 'daily_cap', 'manual_adjustment');--> statement-breakpoint
CREATE TABLE "badge" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"category" "badge_category" NOT NULL,
	"icon_url" text NOT NULL,
	"criteria" text,
	"xp_reward" integer DEFAULT 100 NOT NULL,
	"rarity" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "badge_name_unique" UNIQUE("name"),
	CONSTRAINT "badge_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_badge" (
	"id" text PRIMARY KEY NOT NULL,
	"user_profile_id" text NOT NULL,
	"badge_id" text NOT NULL,
	"earned_at" timestamp NOT NULL,
	"claimed_at" timestamp,
	"is_displayed" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"xp_reward" integer DEFAULT 0 NOT NULL,
	"estimated_duration_minutes" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"short_description" text,
	"image_url" text,
	"thumbnail_url" text,
	"level" text,
	"access_type" "course_access" DEFAULT 'free' NOT NULL,
	"status" "course_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"previous_version_id" text,
	"estimated_duration_minutes" integer,
	"total_xp_reward" integer DEFAULT 0 NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"tags" text[],
	"created_by" text NOT NULL,
	"published_at" timestamp,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "course_prerequisite" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"prerequisite_course_id" text NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"instructions" text NOT NULL,
	"type" "exercise_type" DEFAULT 'code' NOT NULL,
	"difficulty" "exercise_difficulty" DEFAULT 'medium' NOT NULL,
	"starter_code" text,
	"solution_code" text,
	"test_cases" text,
	"hints" text[],
	"max_attempts" integer,
	"time_limit" integer,
	"is_pro" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercise_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"exercise_id" text NOT NULL,
	"user_profile_id" text NOT NULL,
	"code" text NOT NULL,
	"is_passed" boolean DEFAULT false NOT NULL,
	"score" integer,
	"tests_passed" integer DEFAULT 0 NOT NULL,
	"total_tests" integer DEFAULT 0 NOT NULL,
	"execution_time" integer,
	"attempt_number" integer DEFAULT 1 NOT NULL,
	"feedback" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson" (
	"id" text PRIMARY KEY NOT NULL,
	"chapter_id" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"type" "lesson_type" DEFAULT 'content' NOT NULL,
	"content_type" "content_type",
	"display_order" integer DEFAULT 0 NOT NULL,
	"xp_reward" integer DEFAULT 10 NOT NULL,
	"estimated_duration_minutes" integer,
	"is_free" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_content" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"type" "content_type" NOT NULL,
	"content" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"video_url" text,
	"video_duration_seconds" integer,
	"code_language" text,
	"code_snippet" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chapter_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_profile_id" text NOT NULL,
	"chapter_id" text NOT NULL,
	"status" "progress_status" DEFAULT 'not_started' NOT NULL,
	"progress_percentage" integer DEFAULT 0 NOT NULL,
	"xp_earned" integer DEFAULT 0 NOT NULL,
	"lessons_completed" integer DEFAULT 0 NOT NULL,
	"total_lessons" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"last_accessed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_profile_id" text NOT NULL,
	"course_id" text NOT NULL,
	"status" "progress_status" DEFAULT 'not_started' NOT NULL,
	"progress_percentage" integer DEFAULT 0 NOT NULL,
	"total_xp_earned" integer DEFAULT 0 NOT NULL,
	"lessons_completed" integer DEFAULT 0 NOT NULL,
	"total_lessons" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"last_accessed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lesson_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_profile_id" text NOT NULL,
	"lesson_id" text NOT NULL,
	"status" "progress_status" DEFAULT 'not_started' NOT NULL,
	"xp_earned" integer DEFAULT 0 NOT NULL,
	"time_spent_seconds" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp,
	"last_accessed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"objectives" text[] NOT NULL,
	"requirements" text[] NOT NULL,
	"resources" text[],
	"starter_code" text,
	"rubric" text,
	"estimated_hours" integer,
	"is_pro" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"teacher_id" text NOT NULL,
	"status" "project_status" DEFAULT 'under_review' NOT NULL,
	"overall_feedback" text NOT NULL,
	"strengths" text[],
	"improvements" text[],
	"score" integer NOT NULL,
	"rubric_scores" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_feedback_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE "project_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"user_profile_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"repository_url" text,
	"live_url" text,
	"screenshot_urls" text[],
	"notes" text,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"score" integer,
	"submitted_at" timestamp,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz" (
	"id" text PRIMARY KEY NOT NULL,
	"lesson_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"passing_score" integer DEFAULT 70 NOT NULL,
	"time_limit" integer,
	"max_attempts" integer,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_answer" (
	"id" text PRIMARY KEY NOT NULL,
	"question_id" text NOT NULL,
	"answer_text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempt" (
	"id" text PRIMARY KEY NOT NULL,
	"quiz_id" text NOT NULL,
	"user_profile_id" text NOT NULL,
	"score" integer NOT NULL,
	"is_passed" boolean DEFAULT false NOT NULL,
	"attempt_number" integer DEFAULT 1 NOT NULL,
	"time_spent_seconds" integer,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempt_answer" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"question_id" text NOT NULL,
	"selected_answer_ids" text[] NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"points_earned" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_question" (
	"id" text PRIMARY KEY NOT NULL,
	"quiz_id" text NOT NULL,
	"question" text NOT NULL,
	"explanation" text,
	"type" text NOT NULL,
	"points" integer DEFAULT 1 NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_member" (
	"id" text PRIMARY KEY NOT NULL,
	"class_id" text NOT NULL,
	"user_profile_id" text NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"left_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"name" text NOT NULL,
	"code" text,
	"description" text,
	"academic_year" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "school" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"logo_url" text,
	"website" text,
	"contact_email" text,
	"contact_phone" text,
	"address" text,
	"city" text,
	"country" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "school_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "school_admin" (
	"id" text PRIMARY KEY NOT NULL,
	"school_id" text NOT NULL,
	"user_profile_id" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teacher_assignment" (
	"id" text PRIMARY KEY NOT NULL,
	"teacher_id" text NOT NULL,
	"class_id" text,
	"school_id" text,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"unassigned_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_history" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text NOT NULL,
	"user_profile_id" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"payment_method" text,
	"transaction_id" text,
	"invoice_url" text,
	"metadata" text,
	"paid_at" timestamp,
	"refunded_at" timestamp,
	"refund_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_history_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"user_profile_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"auto_renew" boolean DEFAULT false NOT NULL,
	"cancelled_at" timestamp,
	"cancellation_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_user_profile_id_unique" UNIQUE("user_profile_id")
);
--> statement-breakpoint
CREATE TABLE "subscription_plan" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "subscription_type" NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"duration_days" integer,
	"features" text[],
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_plan_type_unique" UNIQUE("type")
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"username" text,
	"bio" text,
	"total_xp" integer DEFAULT 0 NOT NULL,
	"current_level" integer DEFAULT 1 NOT NULL,
	"streak_days" integer DEFAULT 0 NOT NULL,
	"last_activity_date" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_banned" boolean DEFAULT false NOT NULL,
	"banned_at" timestamp,
	"banned_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profile_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "daily_xp" (
	"id" text PRIMARY KEY NOT NULL,
	"user_profile_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"total_xp_earned" integer DEFAULT 0 NOT NULL,
	"capped_at" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "xp_level" (
	"id" text PRIMARY KEY NOT NULL,
	"level" integer NOT NULL,
	"min_xp" integer NOT NULL,
	"max_xp" integer,
	"title" text,
	"icon_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "xp_level_level_unique" UNIQUE("level")
);
--> statement-breakpoint
CREATE TABLE "xp_transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"user_profile_id" text NOT NULL,
	"type" "xp_transaction_type" NOT NULL,
	"amount" integer NOT NULL,
	"reason" text,
	"related_entity_type" text,
	"related_entity_id" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_badge" ADD CONSTRAINT "user_badge_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badge" ADD CONSTRAINT "user_badge_badge_id_badge_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badge"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course" ADD CONSTRAINT "course_previous_version_id_course_id_fk" FOREIGN KEY ("previous_version_id") REFERENCES "public"."course"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_prerequisite" ADD CONSTRAINT "course_prerequisite_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_prerequisite" ADD CONSTRAINT "course_prerequisite_prerequisite_course_id_course_id_fk" FOREIGN KEY ("prerequisite_course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise" ADD CONSTRAINT "exercise_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_submission" ADD CONSTRAINT "exercise_submission_exercise_id_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_submission" ADD CONSTRAINT "exercise_submission_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_chapter_id_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapter"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_content" ADD CONSTRAINT "lesson_content_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_progress" ADD CONSTRAINT "chapter_progress_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapter_progress" ADD CONSTRAINT "chapter_progress_chapter_id_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapter"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_progress" ADD CONSTRAINT "course_progress_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesson_progress" ADD CONSTRAINT "lesson_progress_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_feedback" ADD CONSTRAINT "project_feedback_submission_id_project_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."project_submission"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_submission" ADD CONSTRAINT "project_submission_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_submission" ADD CONSTRAINT "project_submission_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_lesson_id_lesson_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lesson"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_answer" ADD CONSTRAINT "quiz_answer_question_id_quiz_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempt_answer" ADD CONSTRAINT "quiz_attempt_answer_attempt_id_quiz_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."quiz_attempt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempt_answer" ADD CONSTRAINT "quiz_attempt_answer_question_id_quiz_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."quiz_question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_question" ADD CONSTRAINT "quiz_question_quiz_id_quiz_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quiz"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_member" ADD CONSTRAINT "class_member_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_member" ADD CONSTRAINT "class_member_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class" ADD CONSTRAINT "class_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin" ADD CONSTRAINT "school_admin_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_admin" ADD CONSTRAINT "school_admin_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD CONSTRAINT "teacher_assignment_teacher_id_user_profile_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD CONSTRAINT "teacher_assignment_class_id_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."class"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teacher_assignment" ADD CONSTRAINT "teacher_assignment_school_id_school_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."school"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_subscription_id_subscription_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscription"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_history" ADD CONSTRAINT "payment_history_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_plan_id_subscription_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_xp" ADD CONSTRAINT "daily_xp_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_transaction" ADD CONSTRAINT "xp_transaction_user_profile_id_user_profile_id_fk" FOREIGN KEY ("user_profile_id") REFERENCES "public"."user_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_badge_userProfileId_idx" ON "user_badge" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "user_badge_badgeId_idx" ON "user_badge" USING btree ("badge_id");--> statement-breakpoint
CREATE INDEX "user_badge_earnedAt_idx" ON "user_badge" USING btree ("earned_at");--> statement-breakpoint
CREATE INDEX "chapter_courseId_idx" ON "chapter" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "chapter_displayOrder_idx" ON "chapter" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "course_slug_idx" ON "course" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "course_status_idx" ON "course" USING btree ("status");--> statement-breakpoint
CREATE INDEX "course_accessType_idx" ON "course" USING btree ("access_type");--> statement-breakpoint
CREATE INDEX "course_createdBy_idx" ON "course" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "course_publishedAt_idx" ON "course" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "course_prerequisite_courseId_idx" ON "course_prerequisite" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "course_prerequisite_prerequisiteCourseId_idx" ON "course_prerequisite" USING btree ("prerequisite_course_id");--> statement-breakpoint
CREATE INDEX "exercise_lessonId_idx" ON "exercise" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "exercise_type_idx" ON "exercise" USING btree ("type");--> statement-breakpoint
CREATE INDEX "exercise_difficulty_idx" ON "exercise" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "exercise_submission_exerciseId_idx" ON "exercise_submission" USING btree ("exercise_id");--> statement-breakpoint
CREATE INDEX "exercise_submission_userProfileId_idx" ON "exercise_submission" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "lesson_chapterId_idx" ON "lesson" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "lesson_type_idx" ON "lesson" USING btree ("type");--> statement-breakpoint
CREATE INDEX "lesson_displayOrder_idx" ON "lesson" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "lesson_content_lessonId_idx" ON "lesson_content" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_content_displayOrder_idx" ON "lesson_content" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "chapter_progress_userProfileId_idx" ON "chapter_progress" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "chapter_progress_chapterId_idx" ON "chapter_progress" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "chapter_progress_status_idx" ON "chapter_progress" USING btree ("status");--> statement-breakpoint
CREATE INDEX "course_progress_userProfileId_idx" ON "course_progress" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "course_progress_courseId_idx" ON "course_progress" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "course_progress_status_idx" ON "course_progress" USING btree ("status");--> statement-breakpoint
CREATE INDEX "lesson_progress_userProfileId_idx" ON "lesson_progress" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "lesson_progress_lessonId_idx" ON "lesson_progress" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "lesson_progress_status_idx" ON "lesson_progress" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_lessonId_idx" ON "project" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "project_displayOrder_idx" ON "project" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "project_feedback_submissionId_idx" ON "project_feedback" USING btree ("submission_id");--> statement-breakpoint
CREATE INDEX "project_feedback_teacherId_idx" ON "project_feedback" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "project_submission_projectId_idx" ON "project_submission" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_submission_userProfileId_idx" ON "project_submission" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "project_submission_status_idx" ON "project_submission" USING btree ("status");--> statement-breakpoint
CREATE INDEX "quiz_lessonId_idx" ON "quiz" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX "quiz_displayOrder_idx" ON "quiz" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "quiz_answer_questionId_idx" ON "quiz_answer" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "quiz_answer_displayOrder_idx" ON "quiz_answer" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "quiz_attempt_quizId_idx" ON "quiz_attempt" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_attempt_userProfileId_idx" ON "quiz_attempt" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "quiz_attempt_answer_attemptId_idx" ON "quiz_attempt_answer" USING btree ("attempt_id");--> statement-breakpoint
CREATE INDEX "quiz_attempt_answer_questionId_idx" ON "quiz_attempt_answer" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "quiz_question_quizId_idx" ON "quiz_question" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_question_displayOrder_idx" ON "quiz_question" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "class_member_classId_idx" ON "class_member" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "class_member_userProfileId_idx" ON "class_member" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "class_schoolId_idx" ON "class" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "class_code_idx" ON "class" USING btree ("code");--> statement-breakpoint
CREATE INDEX "school_admin_schoolId_idx" ON "school_admin" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "school_admin_userProfileId_idx" ON "school_admin" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "teacher_assignment_teacherId_idx" ON "teacher_assignment" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "teacher_assignment_classId_idx" ON "teacher_assignment" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "teacher_assignment_schoolId_idx" ON "teacher_assignment" USING btree ("school_id");--> statement-breakpoint
CREATE INDEX "payment_history_subscriptionId_idx" ON "payment_history" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "payment_history_userProfileId_idx" ON "payment_history" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "payment_history_status_idx" ON "payment_history" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_history_transactionId_idx" ON "payment_history" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "subscription_userProfileId_idx" ON "subscription" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "subscription_status_idx" ON "subscription" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subscription_endDate_idx" ON "subscription" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "user_profile_userId_idx" ON "user_profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_profile_role_idx" ON "user_profile" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_profile_username_idx" ON "user_profile" USING btree ("username");--> statement-breakpoint
CREATE INDEX "daily_xp_userProfileId_idx" ON "daily_xp" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "daily_xp_date_idx" ON "daily_xp" USING btree ("date");--> statement-breakpoint
CREATE INDEX "xp_transaction_userProfileId_idx" ON "xp_transaction" USING btree ("user_profile_id");--> statement-breakpoint
CREATE INDEX "xp_transaction_type_idx" ON "xp_transaction" USING btree ("type");--> statement-breakpoint
CREATE INDEX "xp_transaction_createdAt_idx" ON "xp_transaction" USING btree ("created_at");