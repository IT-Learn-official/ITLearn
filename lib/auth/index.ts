import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { haveIBeenPwned, lastLoginMethod } from "better-auth/plugins";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "@/lib/emails/send-email";
import { db } from "@/server/database/index";
import {
  account,
  accountRelations,
  rateLimit,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from "@/server/database/schemas/auth";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      account,
      accountRelations,
      rateLimit,
      session,
      sessionRelations,
      user,
      userRelations,
      verification,
    },
  }),

  /* ------------------------------
   * Auth methods
   * ------------------------------ */
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        to: user.email,
        url,
      });
    },
    resetPasswordTokenExpiresIn: 60 * 10,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({
        to: user.email,
        url,
      });
    },
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 10,
  },

  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  /* ------------------------------
   * Sessions
   * ------------------------------ */
  session: {
    expiresIn: 7 * 24 * 60 * 60, // 7 dagen
    updateAge: 60 * 5, // refresh 5 min
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },

  /* ------------------------------
   * Rate limiting
   * ------------------------------ */
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 100,
    modelName: "rateLimit",
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 3,
      },
      "/sign-up": {
        window: 300,
        max: 2,
      },
      "/reset-password": {
        window: 600,
        max: 2,
      },
    },
  },

  /* ------------------------------
   * Plugins
   * ------------------------------ */
  plugins: [
    nextCookies(),
    lastLoginMethod({
      storeInDatabase: true,
    }),
    haveIBeenPwned(),
  ],

  debug: process.env.NODE_ENV !== "production",
});
