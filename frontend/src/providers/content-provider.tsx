"use client"

import * as React from "react"

export type ContentMode = "prod" | "demo"

export interface ContentContextValue {
  mode: ContentMode
  getValue: <T>(key: string, fallback: T) => T
}

const defaultContext: ContentContextValue = {
  mode: "prod",
  getValue: (_key, fallback) => fallback,
}

const ContentContext = React.createContext<ContentContextValue>(defaultContext)

export interface ContentProviderProps {
  children: React.ReactNode
  mode?: ContentMode
  resolver?: (key: string) => unknown
  overrides?: Record<string, unknown>
}

export function ContentProvider({
  children,
  mode = "prod",
  resolver,
  overrides,
}: ContentProviderProps): JSX.Element {
  const store = React.useMemo(() => {
    const map = new Map<string, unknown>()
    if (overrides) {
      for (const [key, value] of Object.entries(overrides)) {
        map.set(key, value)
      }
    }
    return map
  }, [overrides])

  const value = React.useMemo<ContentContextValue>(() => {
    function lookup(key: string): unknown {
      if (store.has(key)) {
        return store.get(key)
      }
      if (resolver) {
        const resolved = resolver(key)
        if (typeof resolved !== "undefined") {
          return resolved
        }
      }
      return undefined
    }

    return {
      mode,
      getValue: (key, fallback) => {
        const resolved = lookup(key)
        if (typeof resolved === "undefined") {
          return fallback
        }
        return resolved as typeof fallback
      },
    }
  }, [mode, resolver, store])

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  )
}

export function useContentValue<T>(key: string, fallback: T): T {
  const { getValue } = React.useContext(ContentContext)
  return getValue(key, fallback)
}

export function useContentMode(): ContentMode {
  const { mode } = React.useContext(ContentContext)
  return mode
}

export function useIsDemoMode(): boolean {
  return useContentMode() === "demo"
}
