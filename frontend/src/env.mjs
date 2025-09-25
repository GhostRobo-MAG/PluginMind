import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  // Server-side environment variables
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    BACKEND_URL: z.string().url().optional(),
    // Optional mailer config (if used)
    RESEND_API_KEY: z.string().optional(),
    RESEND_EMAIL_FROM: z.string().email().optional(),
    RESEND_EMAIL_TO: z.string().email().optional(),
    RESEND_HOST: z.string().optional(),
    RESEND_USERNAME: z.string().optional(),
    RESEND_PORT: z.string().optional(),
  },

  // Client-side environment variables (public)
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_USE_API_PROXY: z.enum(["true", "false"]).optional(),
    NEXT_PUBLIC_SECURE_TOKENS: z.enum(["true", "false"]).optional(),
    NEXT_PUBLIC_API_URL: z.string().url().optional(), // legacy dev-only
  },

  // Runtime mapping
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_USE_API_PROXY: process.env.NEXT_PUBLIC_USE_API_PROXY,
    NEXT_PUBLIC_SECURE_TOKENS: process.env.NEXT_PUBLIC_SECURE_TOKENS,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,

    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    BACKEND_URL: process.env.BACKEND_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_EMAIL_FROM: process.env.RESEND_EMAIL_FROM,
    RESEND_EMAIL_TO: process.env.RESEND_EMAIL_TO,
    RESEND_HOST: process.env.RESEND_HOST,
    RESEND_USERNAME: process.env.RESEND_USERNAME,
    RESEND_PORT: process.env.RESEND_PORT,
  },
})
