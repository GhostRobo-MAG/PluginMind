import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'

// Mock session data for testing
export const mockSession: Session = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    image: 'https://example.com/avatar.jpg',
  },
  expires: '2024-12-31T23:59:59.999Z',
  provider: 'google' as any,
  hasToken: true,
}

// Mock unauthenticated session
export const mockUnauthenticatedSession = null

// Provider wrapper for tests
interface ProvidersProps {
  children: React.ReactNode
  session?: Session | null
}

const AllTheProviders = ({ children, session = null }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: Session | null
}

const customRender = (
  ui: ReactElement,
  {
    session = null,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders session={session}>{children}</AllTheProviders>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export * from '@testing-library/user-event'

// Override render method
export { customRender as render }

// Helper functions for common test scenarios
export const renderWithAuth = (ui: ReactElement, options?: CustomRenderOptions) =>
  customRender(ui, { session: mockSession, ...options })

export const renderWithoutAuth = (ui: ReactElement, options?: CustomRenderOptions) =>
  customRender(ui, { session: null, ...options })

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
})

// Helper to create mock fetch responses
export const setupMockFetch = (responses: { [key: string]: any }) => {
  global.fetch = jest.fn((url: string) => {
    const response = responses[url] || responses['default']
    return Promise.resolve(mockApiResponse(response))
  }) as jest.Mock
}

// Wait for loading states to resolve
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 100))

// Common test IDs and selectors
export const testIds = {
  // Auth components
  signInButton: 'sign-in-button',
  signOutButton: 'sign-out-button',
  googleSignInButton: 'google-sign-in-button',
  githubSignInButton: 'github-sign-in-button',

  // Loading states
  loadingSpinner: 'loading-spinner',

  // Navigation
  headerNav: 'header-nav',
  footerNav: 'footer-nav',

  // Forms
  contactForm: 'contact-form',
  newsletterForm: 'newsletter-form',
}

// Custom matchers
export const customMatchers = {
  toBeInViewport: (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    return {
      pass: (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      ),
      message: () => 'Element is not in viewport'
    }
  }
}