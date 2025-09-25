import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  // JWT-only, no database
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour to match Google token
  },
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // GitHub ready for future
    ...(process.env.GITHUB_CLIENT_ID ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      })
    ] : [])
  ],
  
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Store original provider tokens but mark as server-only
      if (account) {
        token.provider = account.provider
        
        if (account.provider === "google") {
          token.googleIdToken = account.id_token
          token.googleAccessToken = account.access_token
        } else if (account.provider === "github") {
          token.githubAccessToken = account.access_token
        }
        
        // Mark tokens as server-only
        token._serverOnly = true
        
        token.email = profile?.email || user?.email
        token.name = profile?.name || user?.name
        token.picture = (profile as any)?.picture || profile?.image || user?.image
      }
      return token
    },
    
    async session({ session, token }) {
      // CRITICAL: Conditionally include tokens based on environment
      const includeTokensInSession = process.env.NEXT_PUBLIC_SECURE_TOKENS !== 'true'
      
      session.provider = token.provider as string
      
      if (includeTokensInSession) {
        // Legacy mode - will be removed
        session.googleIdToken = token.googleIdToken as string
        session.githubAccessToken = token.githubAccessToken as string
        session.warning = "Tokens exposed to client - migrate to secure mode"
      } else {
        // Secure mode - tokens stay server-side
        session.hasToken = !!token.googleIdToken || !!token.githubAccessToken
        // Never include actual tokens
      }
      
      if (session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    }
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)