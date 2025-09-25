"use client"

import * as React from "react"
import { Analytics } from "@vercel/analytics/react"

export function AnalyticsManager(): JSX.Element | null {
  const [enabled, setEnabled] = React.useState(true)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const isDemo = Boolean(window.__DEMO__ ?? document.documentElement.dataset.demo === "true")
    if (isDemo) {
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return <Analytics />
}

declare global {
  interface Window {
    __DEMO__?: boolean
  }
}
