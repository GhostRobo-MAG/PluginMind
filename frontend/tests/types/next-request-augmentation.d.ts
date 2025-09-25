import type { NextURL } from 'next/dist/server/web/next-url'
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies'
import { INTERNALS as NEXT_INTERNALS } from 'next/dist/server/web/spec-extension/request'

declare global {
  interface Request {
    readonly cookies: RequestCookies
    readonly geo: {
      city?: string
      country?: string
      region?: string
      latitude?: string
      longitude?: string
    } | undefined
    readonly ip: string | undefined
    readonly nextUrl: NextURL
    readonly page: void
    readonly ua: void
    readonly [NEXT_INTERNALS]: {
      cookies: RequestCookies
      geo: {
        city?: string
        country?: string
        region?: string
        latitude?: string
        longitude?: string
      } | undefined
      ip?: string
      url: string
      nextUrl: NextURL
    }
  }
}

export {}
