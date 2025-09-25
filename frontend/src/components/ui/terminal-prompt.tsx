'use client'

import { cn } from '@/lib/utils'

interface TerminalPromptProps {
  children: React.ReactNode
  className?: string
  user?: string
  host?: string
  path?: string
}

export function TerminalPrompt({
  children,
  className,
  user = 'user',
  host = 'pluginmind',
  path = '~',
}: TerminalPromptProps) {
  return (
    <div className={cn('terminal-prompt', className)}>
      <span className="text-primary">{user}</span>
      <span className="text-muted-foreground">@</span>
      <span className="text-accent">{host}</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-primary">{path}</span>
      <span className="text-foreground ml-2">{children}</span>
    </div>
  )
}

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'processing'
  label?: string
  className?: string
}

export function StatusIndicator({
  status,
  label,
  className,
}: StatusIndicatorProps) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    processing: 'bg-yellow-500 animate-pulse',
  }

  return (
    <div className={cn('status-indicator', className)}>
      <div
        className={cn('w-2 h-2 rounded-full', statusColors[status])}
      />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  )
}