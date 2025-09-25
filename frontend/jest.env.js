// Test environment variables - must be set before any imports
process.env.NODE_ENV = 'test'
process.env.NEXTAUTH_SECRET = 'test-secret-at-least-32-characters-long'
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.GOOGLE_CLIENT_ID = 'test-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
process.env.NEXT_PUBLIC_SECURE_TOKENS = 'true'
process.env.NEXT_PUBLIC_USE_API_PROXY = 'true'
process.env.BACKEND_URL = 'http://localhost:8000'

// Additional environment variables for @t3-oss/env validation
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'