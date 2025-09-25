/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

jest.mock('next-auth/jwt')
const mockGetToken = getToken as jest.MockedFunction<typeof getToken>

const originalEnv = process.env

beforeAll(() => {
  process.env = {
    ...originalEnv,
    BACKEND_URL: 'http://localhost:8000',
    BACKEND_ALT_URL: 'http://localhost:8001',
    NEXTAUTH_SECRET: 'test-secret',
    NODE_ENV: 'test',
  }
})

afterAll(() => {
  process.env = originalEnv
})

describe('API proxy route', () => {
  let handleRequest: typeof import('@/app/api/proxy/[...path]/route').GET
  const mockFetch = jest.fn()
  let originalFetch: typeof fetch

  const loadHandler = () => {
    jest.isolateModules(() => {
      const handler = require('@/app/api/proxy/[...path]/route')
      handleRequest = handler.GET
    })
  }

  beforeAll(() => {
    originalFetch = global.fetch
    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: mockFetch as unknown as typeof fetch
    })
  })

  afterAll(() => {
    Object.defineProperty(global, 'fetch', {
      configurable: true,
      writable: true,
      value: originalFetch
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
    mockGetToken.mockReset()
    loadHandler()
  })

  it('forwards successful responses from the backend', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      text: () => Promise.resolve('{"message":"ok"}')
    })

    const request = new NextRequest('http://localhost:3000/api/proxy/health')
    const response = await handleRequest(request, { params: { path: ['health'] } })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/health',
      expect.objectContaining({ method: 'GET' })
    )

    const data = await response.json()
    expect(data).toEqual({ message: 'ok' })
  })

  it('returns 502 when the backend is unreachable and no alternate exists', async () => {
    const originalAlt = process.env.BACKEND_ALT_URL
    delete process.env.BACKEND_ALT_URL
    loadHandler()

    mockFetch.mockRejectedValueOnce(new Error('connection refused'))

    const request = new NextRequest('http://localhost:3000/api/proxy/health')
    const response = await handleRequest(request, { params: { path: ['health'] } })

    expect(response.status).toBe(502)

    if (originalAlt) {
      process.env.BACKEND_ALT_URL = originalAlt
    } else {
      delete process.env.BACKEND_ALT_URL
    }
  })

  it('falls back to the alternate backend when the primary fails', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('primary down'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('{"status":"healthy"}')
      })

    const request = new NextRequest('http://localhost:3000/api/proxy/health')
    const response = await handleRequest(request, { params: { path: ['health'] } })

    expect(mockFetch).toHaveBeenCalledTimes(2)
    const data = await response.json()
    expect(data).toEqual({ status: 'healthy' })
  })

  it('requires x-use-id-token header for auth/google binding', async () => {
    const request = new NextRequest('http://localhost:3000/api/proxy/auth/google', {
      method: 'POST',
    })

    const response = await handleRequest(request, { params: { path: ['auth', 'google'] } })

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body.error).toMatch(/x-use-id-token/i)
  })

  it('injects google id token into auth/google requests', async () => {
    mockGetToken.mockResolvedValueOnce({ googleIdToken: 'mock-token' } as any)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      text: () => Promise.resolve('{"status":"bound"}')
    })

    const request = new NextRequest('http://localhost:3000/api/proxy/auth/google', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-use-id-token': 'true'
      },
      body: JSON.stringify({})
    })

    const response = await handleRequest(request, { params: { path: ['auth', 'google'] } })

    const [, fetchOptions] = mockFetch.mock.calls[0]
    expect(JSON.parse(fetchOptions.body)).toEqual({ id_token: 'mock-token' })
    expect(response.status).toBe(200)
  })

  it('returns 401 when token retrieval fails', async () => {
    mockGetToken.mockRejectedValueOnce(new Error('boom'))

    const request = new NextRequest('http://localhost:3000/api/proxy/auth/google', {
      method: 'POST',
      headers: { 'x-use-id-token': 'true' },
      body: JSON.stringify({})
    })

    const response = await handleRequest(request, { params: { path: ['auth', 'google'] } })
    expect(response.status).toBe(401)
  })

  it('forwards POST bodies for non-auth routes unchanged', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      text: () => Promise.resolve('{"created":true}')
    })

    const payload = { message: 'hello' }
    const request = new NextRequest('http://localhost:3000/api/proxy/data', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    await handleRequest(request, { params: { path: ['data'] } })

    const [, fetchOptions] = mockFetch.mock.calls[0]
    expect(fetchOptions.body).toBe(JSON.stringify(payload))
  })
})
