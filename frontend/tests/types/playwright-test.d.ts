declare module '@playwright/test' {
  export const test: any
  export const expect: any
  export const chromium: any
  export const defineConfig: (...args: any[]) => any
  export const devices: Record<string, any>

  export type Page = any
  export type BrowserContext = any
  export type Route = any
  export type FullConfig = any
}
