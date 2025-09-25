'use client'

import { useState, useEffect } from 'react'
import { useAIServices, useServiceHealth } from '@/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, AlertCircle, XCircle, RefreshCcw } from 'lucide-react'
import type { AIService } from '@/types/api'

interface ServiceSelectorProps {
  onSelect: (service: AIService) => void
  selectedId?: string
  className?: string
}

export function ServiceSelector({ onSelect, selectedId, className }: ServiceSelectorProps) {
  const { services, isLoading, error, refetch } = useAIServices()
  const { health } = useServiceHealth()
  const isError = !!error
  const refresh = refetch
  const [selected, setSelected] = useState<string | undefined>(selectedId)
  
  // Update selected state when selectedId prop changes
  useEffect(() => {
    setSelected(selectedId)
  }, [selectedId])
  
  if (isLoading) {
    return <ServiceSelectorSkeleton />
  }
  
  if (isError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load AI services</span>
          <Button variant="outline" size="sm" onClick={() => refresh()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }
  
  if (!services || services.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No AI services are currently available. Please check back later.
        </AlertDescription>
      </Alert>
    )
  }
  
  const getHealthStatus = (serviceId: string) => {
    if (Array.isArray(health)) {
      const serviceHealth = health.find(h => h.service_id === serviceId)
      return serviceHealth?.status || 'unknown'
    }
    // If health is ServiceHealthMap format
    const serviceHealth = health?.[serviceId]
    return serviceHealth?.healthy ? 'healthy' : 'unhealthy'
  }
  
  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }
  
  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200'
      case 'degraded':
        return 'bg-yellow-50 border-yellow-200'
      case 'unhealthy':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Select AI Service</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => refresh()}
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const healthStatus = getHealthStatus(service.id)
          const isSelected = selected === service.id
          const isDisabled = healthStatus === 'unhealthy'
          
          return (
            <Card
              key={service.id}
              className={`p-4 cursor-pointer transition-all duration-200 ${
                isSelected ? 'border-primary ring-2 ring-primary/20' : ''
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
              ${getHealthColor(healthStatus)}`}
              onClick={() => {
                if (!isDisabled) {
                  setSelected(service.id)
                  onSelect(service)
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{service.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {service.provider} • {service.model}
                  </p>
                  {service.version && (
                    <p className="text-xs text-muted-foreground">
                      v{service.version}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {getHealthIcon(healthStatus)}
                  {service.response_time_ms && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {service.response_time_ms}ms
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {service.capabilities.slice(0, 2).map((cap) => (
                    <Badge key={cap} variant="secondary" className="text-xs px-2 py-0">
                      {cap}
                    </Badge>
                  ))}
                  {service.capabilities.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      +{service.capabilities.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Max tokens: {service.max_tokens.toLocaleString()}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Temperature: {service.temperature_range[0]}-{service.temperature_range[1]}
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary/20">
                  <Badge variant="default" className="w-full justify-center text-xs">
                    Selected
                  </Badge>
                </div>
              )}
              
              {isDisabled && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <Badge variant="destructive" className="w-full justify-center text-xs">
                    Unavailable
                  </Badge>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function ServiceSelectorSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    </div>
  )
}