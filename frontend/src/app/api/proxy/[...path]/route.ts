import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

// Force Node.js runtime for cookie handling and NextAuth integration
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Backend URL from server environment (required)
const BACKEND_URL = process.env.BACKEND_URL
// Optional alternate backend URL for container/WSL setups
const BACKEND_ALT_URL = process.env.BACKEND_ALT_URL
const IS_PROD = process.env.NODE_ENV === 'production'
if (!BACKEND_URL) {
  throw new Error('BACKEND_URL environment variable is required')
}

async function handleRequest(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/')
  const url = `${BACKEND_URL}/${path}`
  
  console.log(`🔗 Proxy request: ${request.method} /${path}`)
  console.log(`📡 Forwarding to: ${url}`)

  try {
    // Prepare headers - forward most headers but handle auth specially
    const headers = new Headers()
    
    // Copy relevant headers from original request
    for (const [key, value] of request.headers.entries()) {
      // Skip headers that must be controlled by fetch or that may be invalid after body changes
      const lower = key.toLowerCase()
      if (!['host', 'origin', 'content-length'].includes(lower)) {
        headers.set(key, value)
      }
    }
    
    // Ensure Content-Type for non-GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD' && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    let body: string | undefined = undefined

    // Special handling for auth/google binding endpoint
    if (path === 'auth/google') {
      // Check for x-use-id-token header (required for binding)
      const useIdToken = request.headers.get('x-use-id-token')
      if (useIdToken !== 'true') {
        console.log(`❌ auth/google requires x-use-id-token header`)
        return NextResponse.json({ 
          error: "x-use-id-token header required for auth/google binding" 
        }, { status: 400 })
      }

      // Get NextAuth JWT token to extract Google ID token
      let token
      try {
        token = await getToken({ 
          req: request, 
          secret: process.env.NEXTAUTH_SECRET 
        })
      } catch (tokenError) {
        console.error(`❌ Failed to retrieve NextAuth token:`, tokenError)
        return NextResponse.json({ 
          error: "Authentication token retrieval failed",
          message: "Could not validate session"
        }, { status: 401 })
      }
      
      if (!token?.googleIdToken) {
        console.log(`❌ No Google ID token available in NextAuth JWT`)
        return NextResponse.json({ error: "No valid Google token available" }, { status: 401 })
      }

      // Do not set Authorization header here to avoid triggering
      // upstream JWT verification in backend rate limiter.
      // The backend /auth/google endpoint reads id_token from JSON body.
      console.log(`✅ Preparing auth/google binding with id_token in body`)

      // Handle request body - add id_token to JSON payload
      if (request.method === 'POST') {
        let jsonBody: Record<string, unknown> = {}
        
        try {
          const bodyText = await request.text()
          if (bodyText) {
            jsonBody = JSON.parse(bodyText) as Record<string, unknown>
          }
        } catch (e) {
          // Empty or invalid JSON body - start with empty object
        }
        
        // Add Google ID token to body
        jsonBody.id_token = (token as { googleIdToken?: string }).googleIdToken
        body = JSON.stringify(jsonBody)
        console.log(`🔐 Added id_token to auth/google request body`)
      }
    } else {
      // For all other endpoints: just forward the body without modification
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        try {
          const bodyText = await request.text()
          body = bodyText || undefined
        } catch (e) {
          console.warn('Could not read request body:', e)
        }
      }
    }

    // Make request to backend with 10s timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    let response: Response
    try {
      response = await fetch(url, {
        method: request.method,
        headers,
        body,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      console.error('❌ Backend fetch failed:', {
        url,
        method: request.method,
        error: fetchError instanceof Error ? fetchError.message : String(fetchError)
      })
      
      // Try alternate backend URL if provided
      if (BACKEND_ALT_URL) {
        const altUrl = `${BACKEND_ALT_URL}/${path}`
        console.log(`🔁 Retrying with alternate backend URL: ${altUrl}`)
        try {
          response = await fetch(altUrl, {
            method: request.method,
            headers,
            body,
            signal: controller.signal,
          })
        } catch (altError) {
          console.error('❌ Alternate backend fetch also failed:', {
            altUrl,
            method: request.method,
            error: altError instanceof Error ? altError.message : String(altError)
          })
          const detail = (altError as Error)?.message || String(altError)
          return NextResponse.json({ 
            error: "Backend unavailable",
            message: "Could not connect to backend service",
            ...(IS_PROD ? {} : { errorDetail: detail, tried: [url, altUrl] })
          }, { status: 502 })
        }
      } else {
        const detail = (fetchError as Error)?.message || String(fetchError)
        // Return 502 Bad Gateway only for actual fetch failures
        return NextResponse.json({ 
          error: "Backend unavailable",
          message: "Could not connect to backend service",
          ...(IS_PROD ? {} : { errorDetail: detail, tried: [url] })
        }, { status: 502 })
      }
    }

    console.log(`📡 Backend response: ${response.status} ${response.statusText}`)

    // Forward response body and status from backend
    let responseData: unknown
    const responseHeaders = new Headers()
    
    try {
      const responseText = await response.text()
      responseData = responseText ? JSON.parse(responseText) as unknown : {}
    } catch (parseError) {
      // If backend returns non-JSON, forward as text
      responseData = { message: "Backend response could not be parsed" }
    }

    // Forward important headers from backend, especially Set-Cookie
    for (const [key, value] of response.headers.entries()) {
      if (['set-cookie', 'content-type', 'cache-control'].includes(key.toLowerCase())) {
        responseHeaders.set(key, value)
      }
    }

    // Add debug header
    responseHeaders.set('X-Proxy-Used', 'true')
    
    return NextResponse.json(responseData, { 
      status: response.status,
      headers: responseHeaders
    })

  } catch (error) {
    console.error("🚨 Unexpected proxy error:", error)
    
    // Return 503 only for unexpected errors (not backend errors)
    return NextResponse.json({ 
      error: "Proxy service error",
      message: "Unexpected error in proxy service"
    }, { status: 503 })
  }
}

// Handle CORS preflight requests
export function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') || ''
  const isProd = process.env.NODE_ENV === 'production'
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
  if (isProd) {
    if (origin) {
      headers['Access-Control-Allow-Origin'] = origin
      headers['Vary'] = 'Origin'
      headers['Access-Control-Allow-Credentials'] = 'true'
    }
  } else {
    headers['Access-Control-Allow-Origin'] = '*'
  }
  return new NextResponse(null, { status: 204, headers })
}

export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const DELETE = handleRequest
export const PATCH = handleRequest
