import nextJest from 'next/jest.js'

// Ensure required environment variables exist before next.config.mjs is loaded
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET ?? 'test-secret-at-least-32-characters-long'
process.env.NEXTAUTH_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? 'test-client-id'
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? 'test-client-secret'
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
process.env.NEXT_PUBLIC_SECURE_TOKENS = process.env.NEXT_PUBLIC_SECURE_TOKENS ?? 'true'
process.env.NEXT_PUBLIC_USE_API_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY ?? 'true'
process.env.BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8000'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test environment for React components
  testEnvironment: 'jsdom',

  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/config/(.*)$': '<rootDir>/src/config/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
  },

  // Environment variables for testing (run before any other setup)
  setupFiles: ['<rootDir>/jest.env.js'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**/loading.tsx',
    '!src/app/**/not-found.tsx',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
    '!src/env.mjs',
    '!src/middleware.ts',
    '!**/node_modules/**',
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Test patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/', // E2E tests are handled by Playwright
  ],

  // Test match patterns (exclude config files)
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],

  // Transform configuration is handled by next/jest
  // transform: {
  //   '^.+\\.(ts|tsx)$': ['ts-jest', {
  //     tsconfig: {
  //       jsx: 'react-jsx',
  //     },
  //   }],
  // },

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
