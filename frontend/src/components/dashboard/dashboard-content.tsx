'use client'

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar, Settings, Zap } from "lucide-react"
import { format } from "date-fns"

export function DashboardContent() {
  const { data: session, status } = useSession()
  const user = session?.user
  const refreshUser = () => {}

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-muted-foreground">No user session found.</p>
          <p className="text-xs text-muted-foreground">Please sign in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  const handleRefreshProfile = async () => {
    try {
      await refreshUser()
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* User Profile Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <Badge variant="secondary">
              Active
            </Badge>
          </div>
          <CardDescription>
            Your account details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm">{user.name || "Not provided"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  {format(new Date(), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">
                  {(() => {
                    try {
                      return format(new Date(), 'MMM dd, yyyy')
                    } catch {
                      return 'Invalid date'
                    }
                  })()}
                </p>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={handleRefreshProfile} variant="outline" size="sm">
              Refresh Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <CardTitle>Quick Actions</CardTitle>
          </div>
          <CardDescription>
            Common tasks and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
          <Button className="w-full" variant="outline">
            <Zap className="mr-2 h-4 w-4" />
            AI Services
          </Button>
          <Button className="w-full" variant="outline">
            <User className="mr-2 h-4 w-4" />
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Welcome Card */}
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Welcome to PluginMind</CardTitle>
          <CardDescription>
            Your AI-powered application platform is ready to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have successfully signed in and can now access all PluginMind features. 
              Use the navigation above to explore different sections or start with the quick actions.
            </p>
            <div className="flex space-x-2">
              <Button>Get Started</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardContent
