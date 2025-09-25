class AuthSecurityMonitor {
  static validateNoTokenExposure() {
    if (typeof window !== 'undefined') {
      // Check window object
      const hasToken = this.searchForTokens(window)
      
      // Check localStorage
      const localStorageToken = localStorage.getItem('token') || 
                               localStorage.getItem('accessToken') ||
                               localStorage.getItem('idToken') ||
                               localStorage.getItem('googleIdToken')
      
      // Check sessionStorage
      const sessionStorageToken = sessionStorage.getItem('token') ||
                                 sessionStorage.getItem('accessToken') ||
                                 sessionStorage.getItem('idToken') ||
                                 sessionStorage.getItem('googleIdToken')
      
      if (hasToken || localStorageToken || sessionStorageToken) {
        console.error('⚠️ SECURITY WARNING: Tokens detected in client-side storage!')
        if (process.env.NODE_ENV === 'development') {
          console.trace('Token exposure detected at:')
        }
        
        // In development, also check for common exposures
        if (process.env.NODE_ENV === 'development') {
          this.checkCommonExposures()
        }
        
        return false
      }
    }
    return true
  }
  
  private static searchForTokens(obj: any, depth = 0, path = ''): boolean {
    if (depth > 5) return false // Prevent infinite recursion
    
    try {
      for (const key in obj) {
        if (obj.hasOwnProperty && !obj.hasOwnProperty(key)) continue
        
        const currentPath = path ? `${path}.${key}` : key
        
        if (this.isTokenKey(key)) {
          if (typeof obj[key] === 'string' && this.looksLikeToken(obj[key])) {
            console.warn(`🔍 Potential token found at: ${currentPath}`)
            console.warn(`🔍 Token preview: ${obj[key].substring(0, 20)}...`)
            return true
          }
        }
        
        if (typeof obj[key] === 'object' && obj[key] !== null && depth < 3) {
          if (this.searchForTokens(obj[key], depth + 1, currentPath)) {
            return true
          }
        }
      }
    } catch (error) {
      // Ignore errors when accessing restricted properties
    }
    
    return false
  }
  
  private static isTokenKey(key: string): boolean {
    const tokenKeys = [
      'token', 'accesstoken', 'idtoken', 'googleidtoken', 'githubtoken',
      'jwt', 'bearer', 'authorization', 'auth', 'credential'
    ]
    return tokenKeys.some(tokenKey => 
      key.toLowerCase().includes(tokenKey)
    )
  }
  
  private static looksLikeToken(value: string): boolean {
    if (typeof value !== 'string') return false
    
    // JWT pattern
    if (value.match(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)) {
      return true
    }
    
    // Google OAuth token patterns
    if (value.startsWith('ya29.') || value.startsWith('1//')) {
      return true
    }
    
    // Generic long token pattern
    if (value.length > 50 && value.match(/^[A-Za-z0-9._-]+$/)) {
      return true
    }
    
    return false
  }
  
  private static checkCommonExposures() {
    // Check React DevTools
    if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.warn('🔍 React DevTools detected - check for token exposure in component state')
    }
    
    // Check Redux DevTools
    if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
      console.warn('🔍 Redux DevTools detected - check for token exposure in store')
    }
    
    // Check for Next.js session in window
    if ((window as any).__NEXT_DATA__) {
      console.warn('🔍 Next.js data detected - checking for token exposure...')
      this.searchForTokens((window as any).__NEXT_DATA__, 0, '__NEXT_DATA__')
    }
  }
  
  static checkSecureMode(): boolean {
    const secureTokens = process.env.NEXT_PUBLIC_SECURE_TOKENS === 'true'
    const useProxy = process.env.NEXT_PUBLIC_USE_API_PROXY === 'true'
    
    if (secureTokens && !useProxy) {
      console.error('⚠️ CONFIGURATION ERROR: SECURE_TOKENS=true but USE_API_PROXY=false')
      return false
    }
    
    if (secureTokens) {
      console.log('✅ Running in secure token mode')
    } else {
      console.warn('⚠️ Running in legacy token mode - tokens may be exposed to client')
    }
    
    return true
  }
  
  static reportTokenExposure(location: string, tokenPreview: string) {
    console.error(`🚨 TOKEN EXPOSURE DETECTED at ${location}`)
    console.error(`🚨 Token preview: ${tokenPreview.substring(0, 20)}...`)
    
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 This is a security vulnerability in development mode')
      console.error('🚨 In production, this could lead to account compromise')
    }
    
    // In development, could send to monitoring service
    if (process.env.NODE_ENV === 'development') {
      this.sendToMonitoring(location, tokenPreview)
    }
  }
  
  private static sendToMonitoring(location: string, tokenPreview: string) {
    // In a real implementation, this could send to a monitoring service
    // For now, just log to console
    console.warn('📊 Would send token exposure report to monitoring service:', {
      location,
      tokenPreview: tokenPreview.substring(0, 10) + '...',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }
}

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Initial check
  setTimeout(() => {
    AuthSecurityMonitor.checkSecureMode()
    AuthSecurityMonitor.validateNoTokenExposure()
  }, 1000)
  
  // Periodic checks
  setInterval(() => {
    AuthSecurityMonitor.validateNoTokenExposure()
  }, 10000) // Check every 10 seconds in development
}

export { AuthSecurityMonitor }