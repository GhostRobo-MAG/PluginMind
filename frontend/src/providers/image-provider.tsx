"use client"

import * as React from "react"

export interface ImageContextValue {
  getImage: (key: string, fallback: string) => string
}

const defaultValue: ImageContextValue = {
  getImage: (_key, fallback) => fallback,
}

const ImageContext = React.createContext<ImageContextValue>(defaultValue)

export interface ImageProviderProps {
  children: React.ReactNode
  resolver?: (key: string) => string | undefined
  overrides?: Record<string, string>
}

export function ImageProvider({
  children,
  resolver,
  overrides,
}: ImageProviderProps): JSX.Element {
  const store = React.useMemo(() => {
    const map = new Map<string, string>()
    if (overrides) {
      for (const [key, value] of Object.entries(overrides)) {
        map.set(key, value)
      }
    }
    return map
  }, [overrides])

  const value = React.useMemo<ImageContextValue>(() => {
    return {
      getImage: (key, fallback) => {
        if (store.has(key)) {
          return store.get(key) as string
        }
        if (resolver) {
          const resolved = resolver(key)
          if (typeof resolved === "string") {
            return resolved
          }
        }
        return fallback
      },
    }
  }, [resolver, store])

  return <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
}

export function useImage(key: string, fallback: string): string {
  const { getImage } = React.useContext(ImageContext)
  return getImage(key, fallback)
}
