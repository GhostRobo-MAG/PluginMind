import type { Session } from 'next-auth'

export const mockSignIn = jest.fn()
export const mockSignOut = jest.fn()

export const mockUseSession = jest.fn()

// Session states for testing
export const authenticatedSession: Session = {
  user: {
    id: 'mock-user-id',
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: 'https://lh3.googleusercontent.com/mock-avatar',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  provider: 'google' as any,
  hasToken: true,
}

export const loadingSession = {
  data: undefined,
  status: 'loading' as const,
}

export const unauthenticatedSession = {
  data: null,
  status: 'unauthenticated' as const,
}

export const authenticatedSessionState = {
  data: authenticatedSession,
  status: 'authenticated' as const,
}

// Helper functions to mock different session states
export const mockAuthenticatedSession = () => {
  mockUseSession.mockReturnValue(authenticatedSessionState)
}

export const mockUnauthenticatedSession = () => {
  mockUseSession.mockReturnValue(unauthenticatedSession)
}

export const mockLoadingSession = () => {
  mockUseSession.mockReturnValue(loadingSession)
}

// Reset all mocks
export const resetAuthMocks = () => {
  mockSignIn.mockClear()
  mockSignOut.mockClear()
  mockUseSession.mockClear()
}