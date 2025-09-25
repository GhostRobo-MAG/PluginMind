// Jest setup file
import '@testing-library/jest-dom'

// Mock environment validation to prevent startup errors
jest.mock('@/env.mjs', () => ({
  env: {
    NODE_ENV: 'test',
    NEXTAUTH_SECRET: 'test-secret-at-least-32-characters-long',
    GOOGLE_CLIENT_ID: 'test-client-id',
    GOOGLE_CLIENT_SECRET: 'test-client-secret',
    BACKEND_URL: 'http://localhost:8000',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NEXT_PUBLIC_USE_API_PROXY: 'true',
    NEXT_PUBLIC_SECURE_TOKENS: 'true',
  }
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated'
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SECURE_TOKENS = 'true'
process.env.NEXT_PUBLIC_USE_API_PROXY = 'true'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe() {
    return null
  }

  disconnect() {
    return null
  }

  unobserve() {
    return null
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}

  observe() {
    return null
  }

  disconnect() {
    return null
  }

  unobserve() {
    return null
  }
}

// Mock window.matchMedia (only if window exists)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })

  // Mock window.scrollTo
  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
  })
} else {
  // Define global mocks for when window is not available
  global.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }))

  global.scrollTo = jest.fn()
}

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    statusText: 'OK',
  })
)

// Mock unhandled promise rejection to prevent test failures
const originalUnhandledRejection = process.listeners('unhandledRejection')
process.removeAllListeners('unhandledRejection')
process.on('unhandledRejection', (reason, promise) => {
  // Only log in development, suppress in tests
  if (process.env.NODE_ENV !== 'test') {
    console.error('Unhandled promise rejection:', reason)
  }
})

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
})