'use client'

import { useState } from 'react'
import { useUsage, useQuota } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BarChart3, Zap, Clock, TrendingUp, RefreshCw } from 'lucide-react'

export function UsageStats() {
  const [period, setPeriod] = useState<'daily' | 'monthly'>('monthly')
  const { usage, error: usageError, isLoading: usageLoading, isValidating: usageValidating, refetch: refreshUsage } = useUsage(period)
  const { quota, error: quotaError, isLoading: quotaLoading, refetch: refreshQuota } = useQuota()
  
  const isLoading = usageLoading || quotaLoading
  const isError = !!usageError || !!quotaError
  const isValidating = usageValidating
  
  const refresh = () => {
    refreshUsage()
    refreshQuota()
  }
  
  if (isLoading) {
    return <UsageStatsSkeleton />
  }
  
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load usage statistics</span>
          <Button variant="outline" size="sm" onClick={() => refresh()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }
  
  if (!usage || !quota) {
    return null
  }
  
  const requestsPercent = Math.min((usage.requests_made / usage.requests_limit) * 100, 100)
  const tokensPercent = Math.min((usage.tokens_used / usage.tokens_limit) * 100, 100)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Usage Statistics</h3>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value as 'daily' | 'monthly')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={() => refresh()} disabled={isValidating}>
            <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subscription Tier */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{quota.tier}</div>
            <Badge variant={quota.tier === 'free' ? 'secondary' : 'default'} className="mt-2">
              {quota.tier === 'free' ? 'Free Tier' : 
               quota.tier === 'pro' ? 'Pro Plan' : 'Enterprise'}
            </Badge>
          </CardContent>
        </Card>
        
        {/* Requests Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requests ({period === 'daily' ? 'Today' : 'This Month'})
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.requests_made.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of {usage.requests_limit.toLocaleString()} limit
            </p>
            <Progress value={requestsPercent} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(requestsPercent)}% used
            </p>
          </CardContent>
        </Card>
        
        {/* Tokens Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tokens ({period === 'daily' ? 'Today' : 'This Month'})
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage.tokens_used.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of {usage.tokens_limit.toLocaleString()} limit
            </p>
            <Progress value={tokensPercent} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(tokensPercent)}% used
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quota Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Daily Requests</p>
              <p className="font-medium">{quota.limits.requests_per_day.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly Tokens</p>
              <p className="font-medium">{quota.limits.tokens_per_month.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Concurrent Jobs</p>
              <p className="font-medium">{quota.limits.concurrent_jobs}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Priority</p>
              <p className="font-medium">Level {quota.limits.priority}</p>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            Usage resets: {new Date(usage.reset_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function UsageStatsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-2 w-full mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}