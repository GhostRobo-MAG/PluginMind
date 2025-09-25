'use client'

import { useState } from 'react'
import { ServiceSelector } from './ServiceSelector'
import { AnalysisForm } from './AnalysisForm'
import type { AIService, JobResult } from '@/types/api'

export function AIServiceDemo() {
  const [selectedService, setSelectedService] = useState<AIService | undefined>()
  const [lastResult, setLastResult] = useState<JobResult | null>(null)
  
  const handleJobComplete = (result: JobResult) => {
    setLastResult(result)
  }
  
  return (
    <div className="space-y-6">
      <ServiceSelector
        onSelect={setSelectedService}
        selectedId={selectedService?.id}
      />
      
      <AnalysisForm
        selectedService={selectedService}
        onJobComplete={handleJobComplete}
      />
      
      {lastResult && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">
            Latest Analysis Complete
          </h4>
          <p className="text-sm text-green-700">
            Processing took {lastResult.metrics.processing_time_ms}ms using {lastResult.metrics.service_used}
          </p>
        </div>
      )}
    </div>
  )
}