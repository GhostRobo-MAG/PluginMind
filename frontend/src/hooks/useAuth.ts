"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { authBridge } from "@/services/auth-bridge.service"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isBinding, setIsBinding] = useState(false)
  const [bindingError, setBindingError] = useState<string | null>(null)
  
  const isSecureMode = process.env.NEXT_PUBLIC_SECURE_TOKENS === 'true'

  // One-time backend binding after successful Google sign-in
  useEffect(() => {
    // Only proceed if we have a valid session AND status is authenticated (not loading)
    if (session?.hasToken && session?.user && status === 'authenticated' && isSecureMode && !isBinding && !bindingError) {
      // Check if we need to perform initial binding
      const hasPerformedBinding = localStorage.getItem('backend-binding-complete')
      
      if (!hasPerformedBinding) {
        setIsBinding(true)
        console.log('🔗 Performing one-time backend binding...')
        
        authBridge.bindWithBackend()
          .then((userData) => {
            console.log('✅ Backend binding completed')
            localStorage.setItem('backend-binding-complete', 'true')
            setIsBinding(false)
          })
          .catch((error) => {
            console.error('❌ Backend binding failed:', error)
            setBindingError(error.message)
            setIsBinding(false)
          })
      }
    }
  }, [session?.hasToken, session?.user, status, isSecureMode, isBinding, bindingError])

  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signIn('google', {
        // Return user to home after auth (not /dashboard)
        callbackUrl: '/',
        redirect: false,
      })
      
      if (result?.error) {
        throw new Error(result.error)
      }
      
      if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    // Clear binding flag on logout
    localStorage.removeItem('backend-binding-complete')
    
    await signOut({
      callbackUrl: '/',
      redirect: true,
    })
  }, [])

  return {
    user: session?.user || null,
    isAuthenticated: isSecureMode ? !!session?.hasToken : !!session?.googleIdToken,
    isLoading: status === "loading" || isBinding,
    signIn: signInWithGoogle,
    signOut: logout,
    session,
    bindingError,
    getToken: () => {
      if (isSecureMode) {
        console.warn('⚠️ getToken() is deprecated in secure mode. Use apiClient with session cookies instead.')
        return null
      }
      return session?.googleIdToken || null
    },
  }
}
