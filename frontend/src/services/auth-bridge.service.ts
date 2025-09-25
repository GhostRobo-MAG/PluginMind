import { getSession } from "next-auth/react"

class AuthBridgeService {
  // Session cookie-based architecture - one-time binding only

  /**
   * One-time backend binding after Google sign-in
   * Creates session cookie for subsequent API calls
   */
  async bindWithBackend() {
    const session = await getSession()
    
    // In secure mode, check for hasToken flag instead of actual token
    if (!session?.hasToken) {
      throw new Error('No valid session for binding')
    }

    try {
      // One-time binding call with x-use-id-token header
      console.log('🔗 Starting one-time backend binding...')
      const response = await fetch("/api/proxy/auth/google", {
        method: "POST",
        headers: { 
          "content-type": "application/json", 
          "x-use-id-token": "true" 
        },
        body: JSON.stringify({}),
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error(`Binding failed: ${response.status}`)
      }

      const userData = await response.json()
      console.log('✅ Backend binding successful, session cookie set:', userData.user?.email)
      return userData
    } catch (error) {
      console.error('Backend binding error:', error)
      throw error
    }
  }

  /**
   * Legacy sync method - deprecated in favor of session cookies
   * @deprecated Use session cookies instead
   */
  async syncWithBackend() {
    console.warn('⚠️ syncWithBackend is deprecated. Session cookies handle auth automatically.')
    throw new Error('syncWithBackend is deprecated. Use bindWithBackend() once after sign-in.')
  }


  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const session = await getSession()
    
    // In secure mode, check hasToken flag (token never exposed to client)
    return !!session?.hasToken
  }

  /**
   * Provide optional auth headers for API client requests.
   * In secure-token mode we rely on HTTP-only cookies, so this returns an empty object.
   * Tests can mock a token-bearing implementation when needed.
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const session = (await getSession()) as Record<string, unknown> | null
    const token = typeof session?.token === 'string' ? (session!.token as string) : undefined

    if (token) {
      return { Authorization: `Bearer ${token}` }
    }

    return {}
  }
}

export const authBridge = new AuthBridgeService()
