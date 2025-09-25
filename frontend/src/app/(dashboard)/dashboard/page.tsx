import type { Metadata } from "next"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard - access your account and manage settings",
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your PluginMind dashboard. Manage your account and access AI services.
            </p>
          </div>

          {/* Dashboard Content */}
          <DashboardContent />
        </div>
      </div>
    </ProtectedRoute>
  )
}