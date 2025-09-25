'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useJobMutations, useJob, useJobResult } from '@/hooks'
import { jobFormSchema, type JobFormInput } from '@/lib/validations/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Loader2, Send, CheckCircle, XCircle, StopCircle } from 'lucide-react'
import type { AIService, JobResult } from '@/types/api'

interface AnalysisFormProps {
  selectedService?: AIService
  onJobComplete?: (result: JobResult) => void
  className?: string
}

export function AnalysisForm({ selectedService, onJobComplete, className }: AnalysisFormProps) {
  const [jobId, setJobId] = useState<string | null>(null)
  const { submitJob, isSubmitting, cancelJob } = useJobMutations()
  const [submitError, setSubmitError] = useState<Error | null>(null)
  const { job } = useJob(jobId)
  const { result } = useJobResult(jobId)
  
  // Check if job is still processing
  const isPolling = job && ['QUEUED', 'PROCESSING'].includes(job.status)
  
  // Handle job completion
  useEffect(() => {
    if (result && onJobComplete) {
      onJobComplete(result)
    }
  }, [result, onJobComplete])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<JobFormInput>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      options: {
        optimize_prompt: true,
        max_tokens: selectedService?.max_tokens ? Math.min(1000, selectedService.max_tokens) : 1000,
        temperature: selectedService?.temperature_range ? selectedService.temperature_range[0] : 0.7,
      },
    },
  })
  
  const optimizePrompt = watch('options.optimize_prompt')
  const maxTokens = watch('options.max_tokens')
  
  // Update form when service changes
  useEffect(() => {
    if (selectedService) {
      setValue('options.max_tokens', Math.min(1000, selectedService.max_tokens))
      setValue('options.temperature', selectedService.temperature_range[0])
    }
  }, [selectedService, setValue])
  
  const onSubmit = async (data: JobFormInput) => {
    if (!selectedService) {
      return
    }
    
    try {
      setSubmitError(null)
      const job = await submitJob({
        ...data,
        service_id: selectedService.id,
      })
      setJobId(job.id)
    } catch (err) {
      console.error('Failed to submit job:', err)
      setSubmitError(err instanceof Error ? err : new Error('Failed to submit job'))
    }
  }
  
  const handleNewAnalysis = () => {
    reset()
    setJobId(null)
  }
  
  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600'
      case 'PROCESSING':
        return 'text-blue-600'
      case 'QUEUED':
        return 'text-yellow-600'
      case 'FAILED':
        return 'text-red-600'
      case 'CANCELLED':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }
  
  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'PROCESSING':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      case 'QUEUED':
        return <Loader2 className="h-4 w-4 text-yellow-600" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'CANCELLED':
        return <StopCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }
  
  // Show completed result
  if (result) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.result?.optimized_prompt && (
            <div>
              <Label className="text-sm font-medium">Optimized Prompt</Label>
              <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                {result.result.optimized_prompt}
              </div>
            </div>
          )}
          
          <div>
            <Label className="text-sm font-medium">Analysis Result</Label>
            <div className="mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap text-sm">
              {result.result?.analysis}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>Processing time: {result.metrics.processing_time_ms}ms</span>
            <span>Tokens used: {result.metrics.tokens_used}</span>
            <span>Service: {result.metrics.service_used}</span>
          </div>
          
          <Button onClick={handleNewAnalysis} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  // Show processing state
  if (jobId && isPolling) {
    return (
      <Card className={className}>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-2">
              {job && getJobStatusIcon(job.status)}
              <span className={`text-lg font-medium ${job ? getJobStatusColor(job.status) : ''}`}>
                {job?.status === 'PROCESSING' ? 'Processing your request...' : 
                 job?.status === 'QUEUED' ? 'Request queued...' : 
                 'Initializing...'}
              </span>
            </div>
            
            {job && (
              <Badge variant="secondary" className="text-xs">
                Job ID: {job.id.slice(0, 8)}...
              </Badge>
            )}
            
            <div className="w-full max-w-xs">
              <Progress value={job?.status === 'PROCESSING' ? 50 : job?.status === 'QUEUED' ? 25 : 0} />
            </div>
            
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {job?.status === 'PROCESSING' 
                ? 'AI service is analyzing your request. This may take a few moments.'
                : 'Your request is in the queue and will be processed shortly.'}
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => jobId && cancelJob(jobId)}
              className="mt-2"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Show submission form
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Submit Analysis Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="input" className="text-sm font-medium">
              Input Text
            </Label>
            <Textarea
              id="input"
              placeholder="Enter the text you want to analyze..."
              className="mt-1 min-h-[120px]"
              {...register('input')}
            />
            {errors.input && (
              <p className="text-sm text-red-500 mt-1">{errors.input.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="optimize"
                {...register('options.optimize_prompt')}
              />
              <Label htmlFor="optimize" className="text-sm">
                Optimize prompt before processing
              </Label>
            </div>
            
            <div>
              <Label htmlFor="max_tokens" className="text-sm font-medium">
                Max Tokens: {maxTokens}
              </Label>
              <input
                type="range"
                id="max_tokens"
                min="100"
                max={selectedService?.max_tokens || 4000}
                step="100"
                className="w-full mt-1"
                {...register('options.max_tokens', { valueAsNumber: true })}
              />
              {errors.options?.max_tokens && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.options.max_tokens.message}
                </p>
              )}
            </div>
          </div>
          
          {optimizePrompt && (
            <Alert>
              <AlertDescription>
                Your prompt will be automatically optimized for better results with the selected AI service.
              </AlertDescription>
            </Alert>
          )}
          
          {submitError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {submitError.message.includes('Authentication') ? (
                  <div className="space-y-2">
                    <p>Please sign in to use AI services. Authentication is required.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.location.href = '/signin?callbackUrl=/demo/ai'}
                    >
                      Sign In
                    </Button>
                  </div>
                ) : (
                  submitError.message || 'Failed to submit job. Please try again.'
                )}
              </AlertDescription>
            </Alert>
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !selectedService}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Analyze Text
              </>
            )}
          </Button>
          
          <div className="text-sm text-muted-foreground text-center">
            <p>✨ AI analysis requires authentication</p>
          </div>
          
          {!selectedService && (
            <p className="text-sm text-muted-foreground text-center">
              Please select an AI service above to continue
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}