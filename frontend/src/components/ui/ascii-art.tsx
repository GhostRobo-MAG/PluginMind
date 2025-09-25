'use client'

import { cn } from '@/lib/utils'

interface AsciiArtProps {
  children: React.ReactNode
  className?: string
}

export function AsciiArt({ children, className }: AsciiArtProps) {
  return (
    <pre className={cn('ascii-art', className)}>
      {children}
    </pre>
  )
}

export function PluginMindAsciiLogo({ className }: { className?: string }) {
  return (
    <AsciiArt className={className}>
{`  ██╗   ██╗  ██████╗  ██╗   ██╗ ██████╗      █████╗ ██████╗ ██████╗
   ╚██╗ ██╔╝ ██╔═══██╗ ██║   ██║ ██╔══██╗    ██╔══██╗██╔══██╗██╔══██╗
    ╚████╔╝  ██║   ██║ ██║   ██║ ██████╔╝    ███████║██████╔╝██████╔╝
    ╚██╔╝   ██║   ██║ ██║   ██║ ██╔══██╗    ██╔══██║██╔═══╝ ██╔═══╝
 ██║    ╚██████╔╝ ╚██████╔╝ ██║  ██║    ██║  ██║██║     ██║
      ╚═╝     ╚═════╝   ╚═════╝  ╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝     ╚═╝     `}
    </AsciiArt>
  )
}