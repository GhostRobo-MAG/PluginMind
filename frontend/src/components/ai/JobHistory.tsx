'use client'

import { useState } from 'react'
import { useJobs } from '@/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, RefreshCw, Calendar, Clock, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { JobStatus } from '@/types/api'

interface JobHistoryProps {
  className?: string
}

export function JobHistory({ className }: JobHistoryProps) {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all')
  const perPage = 10
  
  const { 
    jobs, 
    totalJobs, 
    totalPages, 
    currentPage, 
    hasNext, 
    hasPrev, 
    isLoading, 
    error, 
    isValidating, 
    refetch 
  } = useJobs({
    status: statusFilter === 'all' ? undefined : statusFilter,
    page,
    page_size: perPage,
  })
  
  const isError = !!error
  const refresh = refetch
  
  // Create pagination object to match existing usage
  const pagination = {
    total: totalJobs,
    page: currentPage,
    per_page: perPage,
    has_next: hasNext,
    has_prev: hasPrev,
  }
  
  if (isError) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load job history</span>
              <Button variant="outline" size="sm" onClick={() => refresh()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }
  
  if (isLoading) {
    return <JobHistorySkeleton className={className} />
  }
  
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'QUEUED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }
  
  const statusOptions = [
    { value: 'all', label: 'All Jobs' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'QUEUED', label: 'Queued' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Job History
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refresh()}
            disabled={isValidating}
          >
            <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex-1">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value as JobStatus | 'all')
                setPage(1)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {pagination && (
            <div className="text-sm text-muted-foreground">
              {pagination.total} total jobs
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {statusFilter === 'all' ? 'No jobs found' : `No ${statusFilter.toLowerCase()} jobs found`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                      {job.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground font-mono">
                      {job.service_id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm truncate pr-4" title={job.input}>
                    {job.input}
                  </p>
                  
                  {job.error && (
                    <p className="text-xs text-red-600 mt-1 truncate" title={job.error}>
                      Error: {job.error}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {job.processing_time_ms && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {job.processing_time_ms}ms
                      </div>
                    )}
                    {job.tokens_used && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {job.tokens_used} tokens
                      </div>
                    )}
                    <span className="font-mono text-xs">
                      {job.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {pagination && (pagination.has_prev || pagination.has_next) && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.has_prev}
            >
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.per_page)}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.has_next}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function JobHistorySkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-10 w-48 mt-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}