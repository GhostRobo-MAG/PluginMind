"use client"

import * as React from "react"

import { ContentProvider } from "@/providers/content-provider"
import { productionContentResolver } from "@/config/production-content"

export interface ProductionContentProviderProps {
  children: React.ReactNode
  overrides?: Record<string, unknown>
}

export function ProductionContentProvider({
  children,
  overrides,
}: ProductionContentProviderProps): JSX.Element {
  return (
    <ContentProvider
      mode="prod"
      resolver={productionContentResolver}
      overrides={overrides}
    >
      {children}
    </ContentProvider>
  )
}