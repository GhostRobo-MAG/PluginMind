'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { siteConfig } from '@/config/site'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ApiErrorBoundary } from '@/components/error-boundary'
import { SWRProvider } from '@/hooks/swr-provider'
import { Bot, History, BarChart3, Loader2, Code, Wrench } from 'lucide-react'
import { AIServiceDemo } from '@/components/ai/AIServiceDemo'
import { JobHistory } from '@/components/ai/JobHistory'
import { UsageStats } from '@/components/ai/UsageStats'

export default function AIServicesPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if AI services are enabled
    if (!siteConfig.features.aiServices) {
      router.push('/')
      return
    }

    // Wait for session to load
    if (status === 'loading') {
      return
    }

    console.log('🔐 Client-side auth check for /ai:', {
      sessionStatus: status,
      hasSession: !!session,
      userEmail: session?.user?.email
    })

    // Optional authentication - allow anonymous usage for template demo
    setIsLoading(false)
  }, [router, session, status])

  if (isLoading || status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-lg">Loading AI Services...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SWRProvider>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AI Services Showcase</h1>
            <Badge variant="secondary">Live Demo</Badge>
          </div>
          <p className="text-muted-foreground">
            Experience the power of multiple AI services integrated into one platform.
            This template includes a complete AI service registry with plugin architecture.
          </p>
        </div>

        <ApiErrorBoundary>
          <Tabs defaultValue="analyze" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="analyze" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Usage</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<AIServiceDemoSkeleton />}>
                    <AIServiceDemo />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Suspense fallback={<JobHistorySkeleton />}>
                <JobHistory />
              </Suspense>
            </TabsContent>

            <TabsContent value="stats">
              <Suspense fallback={<UsageStatsSkeleton />}>
                <UsageStats />
              </Suspense>
            </TabsContent>
          </Tabs>
        </ApiErrorBoundary>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Template Features</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This AI SaaS template includes production-ready features:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Plugin-based AI service registry architecture</li>
              <li>• Multiple AI provider support (OpenAI, Anthropic, etc.)</li>
              <li>• Real-time job processing with WebSocket updates</li>
              <li>• Session-based authentication with NextAuth</li>
              <li>• Comprehensive error handling and retry logic</li>
              <li>• Usage tracking and quota management</li>
            </ul>
          </Card>

          <Card className="p-6 bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Customization Guide</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Ready to customize for your use case:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Add your AI service providers in the registry</li>
              <li>• Customize prompt templates and processing logic</li>
              <li>• Configure authentication providers and settings</li>
              <li>• Update branding, colors, and content</li>
              <li>• Deploy with included Docker configuration</li>
              <li>• Scale with production-ready FastAPI backend</li>
            </ul>
          </Card>
        </div>
      </div>
    </SWRProvider>
  )
}

function AIServiceDemoSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}

function JobHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function UsageStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}