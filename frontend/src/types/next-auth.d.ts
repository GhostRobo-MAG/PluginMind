import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    provider?: string
    googleIdToken?: string
    githubAccessToken?: string
    hasToken?: boolean
    warning?: string
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string
    googleIdToken?: string
    googleAccessToken?: string
    githubAccessToken?: string
    picture?: string
    _serverOnly?: boolean
  }
}