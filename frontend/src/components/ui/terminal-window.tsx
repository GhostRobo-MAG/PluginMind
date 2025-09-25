'use client'

import { cn } from '@/lib/utils'

interface TerminalWindowProps {
  children: React.ReactNode
  title?: string
  className?: string
  showDots?: boolean
}

export function TerminalWindow({
  children,
  title = 'Terminal',
  className,
  showDots = true,
}: TerminalWindowProps) {
  return (
    <div className={cn('terminal-window', className)}>
      <div className="terminal-header">
        {showDots && (
          <div className="terminal-dots">
            <div className="terminal-dot terminal-dot-red" />
            <div className="terminal-dot terminal-dot-yellow" />
            <div className="terminal-dot terminal-dot-green" />
          </div>
        )}
        <span className="text-sm text-muted-foreground ml-2">{title}</span>
      </div>
      <div className="terminal-content">{children}</div>
    </div>
  )
}