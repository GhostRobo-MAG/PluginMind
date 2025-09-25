declare module '@/env.mjs' {
  export const env: Record<string, string> & {
    NEXT_PUBLIC_APP_URL: string
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    RESEND_EMAIL_FROM: string
    RESEND_EMAIL_TO: string
  }
}
