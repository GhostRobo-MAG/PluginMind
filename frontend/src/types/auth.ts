// Authentication related types for JWT-based auth system

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  picture?: string  // Backend field name for Google profile picture
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthTokens {
  access_token: string
  token_type: string
  expires_in: number
}

export interface AuthResponse {
  user: User
  access_token: string
  token_type: string
  expires_in: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// AuthError is now a class exported from auth.service.ts

export interface LoginCredentials {
  email: string
  password: string
}

export interface GoogleOAuthCredential {
  credential: string
}

// Auth context type for React context
export interface AuthContextType extends AuthState {
  signIn: (credentials: LoginCredentials) => Promise<void>
  signInWithGoogle: (credential: GoogleOAuthCredential) => Promise<void>
  signOut: () => void
  refreshUser: () => Promise<void>
  clearError: () => void
}

// Storage interface for token management
export interface TokenStorage {
  getToken: () => string | null
  setToken: (token: string) => void
  removeToken: () => void
  getUser: () => User | null
  setUser: (user: User) => void
  removeUser: () => void
  clear: () => void
}