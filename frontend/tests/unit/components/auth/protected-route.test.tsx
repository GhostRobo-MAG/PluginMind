import { screen } from '@testing-library/react'
import type { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { render } from '../../../utils/test-utils'

jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockUseSession.mockReset()
  })

  const withSession = (session: Session | null, status: ReturnType<typeof useSession>['status']) => ({
    data: session,
    status,
    update: jest.fn(),
  }) as ReturnType<typeof useSession>

  const authenticatedSession: Session = {
    user: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    },
    expires: '2099-12-31T23:59:59.999Z',
  }

  it('renders children for authenticated users', () => {
    mockUseSession.mockReturnValue(withSession(authenticatedSession, 'authenticated'))

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('redirects unauthenticated users to sign-in', () => {
    mockUseSession.mockReturnValue(withSession(null, 'unauthenticated'))

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockPush).toHaveBeenCalledWith('/auth/signin')
  })

  it('renders loader while authentication is pending', () => {
    mockUseSession.mockReturnValue(withSession(null, 'loading'))

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
