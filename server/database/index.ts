import { drizzle } from "drizzle-orm/node-postgres";
import {
  account,
  accountRelations,
  rateLimit,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "./schemas/auth";
import {
  badge,
  badgeRelations,
  userBadge,
  userBadgeRelations,
} from "./schemas/badges";
import { chapter, chapterRelations } from "./schemas/chapters";
import {
  course,
  coursePrerequisite,
  coursePrerequisiteRelations,
  courseRelations,
} from "./schemas/courses";
import {
  exercise,
  exerciseRelations,
  exerciseSubmission,
  exerciseSubmissionRelations,
} from "./schemas/exercises";
import {
  lesson,
  lessonContent,
  lessonContentRelations,
  lessonRelations,
} from "./schemas/lessons";
import {
  chapterProgress,
  chapterProgressRelations,
  courseProgress,
  courseProgressRelations,
  lessonProgress,
  lessonProgressRelations,
} from "./schemas/progress";
import {
  project,
  projectFeedback,
  projectFeedbackRelations,
  projectRelations,
  projectSubmission,
  projectSubmissionRelations,
} from "./schemas/projects";
import {
  quiz,
  quizAnswer,
  quizAnswerRelations,
  quizAttempt,
  quizAttemptAnswer,
  quizAttemptAnswerRelations,
  quizAttemptRelations,
  quizQuestion,
  quizQuestionRelations,
  quizRelations,
} from "./schemas/quizzes";
import {
  classMember,
  classMemberRelations,
  classRoom,
  classRoomRelations,
  school,
  schoolAdmin,
  schoolAdminRelations,
  schoolRelations,
  teacherAssignment,
  teacherAssignmentRelations,
} from "./schemas/schools";
import {
  paymentHistory,
  paymentHistoryRelations,
  subscription,
  subscriptionPlan,
  subscriptionPlanRelations,
  subscriptionRelations,
} from "./schemas/subscriptions";
import { userProfile, userProfileRelations } from "./schemas/users";
import {
  dailyXp,
  dailyXpRelations,
  xpLevel,
  xpTransaction,
  xpTransactionRelations,
} from "./schemas/xp";

export const db = drizzle(process.env.DATABASE_URL || "", {
  schema: {
    // Auth
    account,
    accountRelations,
    rateLimit,
    session,
    sessionRelations,
    user,
    userRelations,
    verification,
    // Users
    userProfile,
    userProfileRelations,
    // Subscriptions
    subscription,
    subscriptionRelations,
    subscriptionPlan,
    subscriptionPlanRelations,
    paymentHistory,
    paymentHistoryRelations,
    // Courses
    course,
    courseRelations,
    coursePrerequisite,
    coursePrerequisiteRelations,
    chapter,
    chapterRelations,
    lesson,
    lessonRelations,
    lessonContent,
    lessonContentRelations,
    // Quizzes
    quiz,
    quizRelations,
    quizQuestion,
    quizQuestionRelations,
    quizAnswer,
    quizAnswerRelations,
    quizAttempt,
    quizAttemptRelations,
    quizAttemptAnswer,
    quizAttemptAnswerRelations,
    // Exercises
    exercise,
    exerciseRelations,
    exerciseSubmission,
    exerciseSubmissionRelations,
    // Projects
    project,
    projectRelations,
    projectSubmission,
    projectSubmissionRelations,
    projectFeedback,
    projectFeedbackRelations,
    // Progress
    courseProgress,
    courseProgressRelations,
    chapterProgress,
    chapterProgressRelations,
    lessonProgress,
    lessonProgressRelations,
    // XP
    xpTransaction,
    xpTransactionRelations,
    dailyXp,
    dailyXpRelations,
    xpLevel,
    // Badges
    badge,
    badgeRelations,
    userBadge,
    userBadgeRelations,
    // Schools
    school,
    schoolRelations,
    schoolAdmin,
    schoolAdminRelations,
    classRoom,
    classRoomRelations,
    classMember,
    classMemberRelations,
    teacherAssignment,
    teacherAssignmentRelations,
  },
});
