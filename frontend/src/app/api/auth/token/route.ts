import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { NextResponse } from "next/server"

// Feature flag - start with disabled
const SECURE_TOKEN_HANDLING = process.env.NEXT_PUBLIC_SECURE_TOKENS === 'true'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // New secure approach - never send actual token
    if (SECURE_TOKEN_HANDLING) {
      return NextResponse.json({ 
        hasToken: true,
        userId: session.user?.id,
        provider: session.provider,
        // Never include the actual token
      })
    }
    
    // TEMPORARY: Old approach for backwards compatibility
    // This will be removed once new approach is verified
    return NextResponse.json({ 
      token: session.googleIdToken, // Will be removed
      warning: "Using legacy token handling"
    })
  } catch (error) {
    console.error("Token handler error:", error)
    // Fallback to legacy method on any error
    return NextResponse.json({ 
      error: "Token handler failed, use legacy method",
      useLegacy: true 
    }, { status: 500 })
  }
}