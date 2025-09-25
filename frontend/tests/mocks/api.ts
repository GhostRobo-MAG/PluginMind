export type MockFetch = jest.Mock<Promise<Response>, [string, RequestInit?]>

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json' },
      ...init,
    }),
  )

export const mockHealthResponse = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  services: {
    database: 'connected',
    redis: 'connected',
  },
}

export const mockAuthResponse = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
  },
  session: {
    token: 'mock-session-token',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
}

export const mockAnalysisJobResponse = {
  id: 'job-123',
  status: 'completed',
  result: {
    analysis: 'Mock analysis result',
    confidence: 0.85,
    metadata: {
      processingTime: 1500,
      tokens: 150,
    },
  },
  createdAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
}

export const mockErrorResponse = {
  error: 'Internal Server Error',
  message: 'Something went wrong',
  statusCode: 500,
}

export const mockUnauthorizedResponse = {
  error: 'Unauthorized',
  message: 'Authentication required',
  statusCode: 401,
}

export const setupApiMocks = (): MockFetch => {
  const mockFetch: MockFetch = jest.fn(async (url: string, options?: RequestInit) => {
    const headers = new Headers(options?.headers as HeadersInit | undefined)

    if (url.includes('/health')) {
      return jsonResponse(mockHealthResponse)
    }

    if (url.includes('/auth/google')) {
      if (headers.get('x-use-id-token') !== 'true') {
        return jsonResponse(
          { error: 'x-use-id-token header required for auth/google binding' },
          { status: 400 },
        )
      }
      return jsonResponse(mockAuthResponse)
    }

    if (url.includes('/analysis')) {
      return jsonResponse(mockAnalysisJobResponse)
    }

    if (url.includes('/protected')) {
      return jsonResponse(mockUnauthorizedResponse, { status: 401 })
    }

    return jsonResponse({
      error: 'Not Found',
      message: 'Endpoint not found',
      statusCode: 404,
    }, { status: 404 })
  })

  global.fetch = mockFetch as unknown as typeof fetch
  return mockFetch
}

export const mockApiCall = (endpoint: string, response: unknown, status = 200) => {
  const implementation: MockFetch = jest.fn(async (url: string) => {
    if (url.includes(endpoint)) {
      return jsonResponse(response, { status })
    }
    throw new Error(`Unexpected API call: ${url}`)
  })

  global.fetch = implementation as unknown as typeof fetch
}

export const resetApiMocks = () => {
  if (jest.isMockFunction(global.fetch)) {
    (global.fetch as MockFetch).mockClear()
  }
}
