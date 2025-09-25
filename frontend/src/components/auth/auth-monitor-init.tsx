"use client"

import { useEffect } from "react"

export function AuthMonitorInit() {
  useEffect(() => {
    // Import and initialize auth monitor only on client side
    import("@/lib/auth-monitor").then(({ AuthSecurityMonitor }) => {
      // Initial security check
      AuthSecurityMonitor.checkSecureMode()
      AuthSecurityMonitor.validateNoTokenExposure()
    })
  }, [])

  // This component doesn't render anything
  return null
}