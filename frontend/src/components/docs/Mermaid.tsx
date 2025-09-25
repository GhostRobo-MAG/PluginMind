'use client'

import { useEffect, useId, useState } from 'react'

import { useTheme } from 'next-themes'

type MermaidProps = {
  definition: string
}

export default function Mermaid({ definition }: MermaidProps) {
  const [diagram, setDiagram] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const id = useId().replace(/[:]/g, '')
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    let isMounted = true

    async function renderDiagram() {
      setIsLoading(true)
      setError(null)

      try {
        const mermaidModule = await import('mermaid')

        const mermaid = mermaidModule.default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
          themeVariables:
            resolvedTheme === 'dark'
              ? {
                  background: 'transparent',
                  primaryColor: '#1f2937',
                  primaryTextColor: '#e5e7eb',
                  lineColor: '#4b5563',
                  secondaryColor: '#374151',
                  tertiaryColor: '#111827',
                  fontFamily: 'Inter, ui-sans-serif, system-ui',
                }
              : {
                  background: 'transparent',
                  primaryColor: '#eef2ff',
                  primaryTextColor: '#111827',
                  lineColor: '#9ca3af',
                  secondaryColor: '#f3f4f6',
                  tertiaryColor: '#111827',
                  fontFamily: 'Inter, ui-sans-serif, system-ui',
                },
        })

        const { svg } = await mermaid.render(`mermaid-${id}`, definition)

        if (!isMounted) return

        setDiagram(svg)
      } catch (err) {
        console.error('Mermaid rendering failed', err)
        if (isMounted) {
          setError('Unable to render diagram')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void renderDiagram()

    return () => {
      isMounted = false
    }
  }, [definition, id, resolvedTheme])

  if (error) {
    return (
      <div className="my-6 overflow-hidden rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        <p className="font-medium">{error}</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs text-destructive/80">
          {definition}
        </pre>
      </div>
    )
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border bg-muted/40 p-4 dark:bg-background/60">
      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Rendering diagram…
        </div>
      ) : (
        <div
          className="[&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-full"
          dangerouslySetInnerHTML={diagram ? { __html: diagram } : undefined}
          role="img"
          aria-label="Mermaid diagram"
        />
      )}
    </div>
  )
}
