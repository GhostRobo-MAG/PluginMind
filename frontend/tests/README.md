# PluginMind Frontend Test Suite

This directory contains a comprehensive test suite for the PluginMind frontend application, built with Next.js 14, TypeScript, and modern testing frameworks.

## 📋 Test Structure

```
tests/
├── unit/                    # Unit tests for components, utilities, and hooks
│   ├── components/
│   │   ├── auth/           # Authentication component tests
│   │   ├── forms/          # Form component tests
│   │   └── ui/             # UI component tests
│   └── api/                # API route and proxy tests
├── integration/            # Integration tests (future)
├── e2e/                    # End-to-end tests with Playwright
├── utils/                  # Test utilities and helpers
├── mocks/                  # Mock implementations
└── README.md              # This file
```

## 🛠️ Testing Stack

### Unit & Integration Testing
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom Jest matchers

### End-to-End Testing
- **Playwright** - Cross-browser E2E testing
- **@playwright/test** - Test runner for E2E tests

### Test Configuration
- **jest.config.js** - Jest configuration
- **jest.setup.js** - Global test setup and mocks
- **playwright.config.ts** - Playwright configuration

## 🚀 Running Tests

### Development Commands

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run all tests (unit + E2E)
pnpm test:all
```

### CI Commands

```bash
# Run unit tests for CI (no watch mode)
pnpm test:ci

# Run E2E tests for CI
pnpm test:e2e
```

## 📊 Test Coverage

The test suite maintains high coverage standards:

- **Overall Target**: 70%
- **Authentication Components**: 85%
- **API Proxy**: 80%
- **Forms**: 80%
- **UI Components**: 75%

Coverage reports are generated in the `coverage/` directory and uploaded to Codecov in CI.

## 🔧 Test Configuration

### Environment Variables

Tests use the following environment variables:

```bash
# Test environment settings
NEXT_PUBLIC_SECURE_TOKENS=true
NEXT_PUBLIC_USE_API_PROXY=true
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=test-secret-key
GOOGLE_CLIENT_ID=test-google-client-id
GOOGLE_CLIENT_SECRET=test-google-client-secret
BACKEND_URL=http://localhost:8000
```

### Mock Strategy

- **NextAuth** - Mocked in `tests/mocks/next-auth.ts`
- **API calls** - Mocked using `tests/mocks/api.ts`
- **Browser APIs** - Global mocks in `jest.setup.js`

## 📝 Writing Tests

### Unit Tests

Use the custom render function with testing providers:

```typescript
import { render, screen } from '../../../utils/test-utils'
import { MyComponent } from '@/components/MyComponent'

test('renders component correctly', () => {
  render(<MyComponent />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

// Test with authentication
test('renders for authenticated user', () => {
  renderWithAuth(<MyComponent />)
  expect(screen.getByText('Welcome')).toBeInTheDocument()
})
```

### E2E Tests

Structure E2E tests with proper setup and teardown:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup mocks and navigate to page
    await setupAuthMocks(page)
    await page.goto('/feature')
  })

  test('should complete user flow', async ({ page }) => {
    // Test user interactions
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Success')).toBeVisible()
  })
})
```

## 🔍 Test Categories

### 1. Authentication Tests
- OAuth button interactions
- Protected route behavior
- Session management
- Sign-in/sign-out flows

### 2. API Proxy Tests
- Request forwarding
- Authentication token handling
- Error handling
- CORS and headers

### 3. Component Tests
- UI component rendering
- User interactions
- Form validation
- Accessibility compliance

### 4. E2E Tests
- Complete user workflows
- Cross-browser compatibility
- Authentication flows
- Error scenarios

## 🚨 Quality Gates

### CI/CD Pipeline

Tests run automatically on:
- Push to `main`, `develop`, and feature branches
- Pull requests to `main` and `develop`

### Quality Thresholds

- **Unit Tests**: Must pass 100%
- **E2E Tests**: Must pass 100%
- **Code Coverage**: Must meet component-specific thresholds
- **Security Scan**: No high/critical vulnerabilities
- **Accessibility**: Core user flows must be accessible

## 🐛 Debugging Tests

### Unit Test Debugging

```bash
# Debug specific test
pnpm test --testNamePattern="test name" --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand --testNamePattern="test name"
```

### E2E Test Debugging

```bash
# Debug mode with browser UI
pnpm test:e2e --debug

# Headed mode
pnpm test:e2e --headed

# Trace mode
pnpm test:e2e --trace on
```

### Common Issues

1. **Import Errors**: Check path mapping in `jest.config.js`
2. **Mock Issues**: Verify mocks are properly set up in `jest.setup.js`
3. **Timeout Issues**: Increase timeout in test configuration
4. **E2E Flakiness**: Add proper wait conditions and stable selectors

## 📚 Testing Best Practices

### General Guidelines

1. **Test Behavior, Not Implementation** - Focus on what users can observe
2. **Use Proper Selectors** - Prefer role-based queries over class names
3. **Mock External Dependencies** - Keep tests isolated and fast
4. **Write Descriptive Test Names** - Make intent clear from the name

### Authentication Testing

1. **Mock NextAuth Properly** - Use provided test utilities
2. **Test Protected Routes** - Verify authentication requirements
3. **Test Session Management** - Check session lifecycle
4. **Test Error Cases** - Handle authentication failures gracefully

### E2E Testing

1. **Use Page Object Model** - Encapsulate page interactions
2. **Set Up Proper Test Data** - Use consistent, isolated test data
3. **Handle Async Operations** - Use proper wait strategies
4. **Test Critical User Paths** - Focus on business-critical workflows

## 🔗 Related Documentation

- [Next.js Testing Guide](https://nextjs.org/docs/testing)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## 🤝 Contributing

When adding new tests:

1. Follow the existing test structure and naming conventions
2. Include both positive and negative test cases
3. Ensure proper test isolation and cleanup
4. Update coverage thresholds if adding new components
5. Add E2E tests for new user-facing features

For questions or issues with the test suite, please refer to the team documentation or create an issue in the project repository.