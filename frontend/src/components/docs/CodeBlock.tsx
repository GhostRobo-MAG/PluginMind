'use client'

import { useEffect, useMemo, useState } from 'react'

import { Highlight, Prism, themes } from 'prism-react-renderer'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

import { Check, Copy } from 'lucide-react'

type CodeBlockProps = {
  code: string
  language?: string
}

type PrismLanguageKey = Extract<keyof typeof Prism.languages, string>

const DEFAULT_LANGUAGE: PrismLanguageKey = 'text'

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const formattedCode = useMemo(() => code.replace(/\s+$/, '\n'), [code])

  const safeLanguage = useMemo<PrismLanguageKey>(() => {
    const normalized = language?.toLowerCase()

    if (!normalized) return DEFAULT_LANGUAGE

    return Prism.languages[normalized]
      ? (normalized as PrismLanguageKey)
      : DEFAULT_LANGUAGE
  }, [language])

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch (error) {
      console.error('Unable to copy code block', error)
    }
  }

  return (
    <figure className="group relative overflow-hidden rounded-lg border border-border/80 bg-background/75 text-sm shadow-sm">
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        {language ? (
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            {language}
          </span>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={copied ? 'Code copied' : 'Copy code block'}
          className="h-8 w-8 rounded-full border-border bg-background/80 text-muted-foreground transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={handleCopy}
        >
          <span className="sr-only">{copied ? 'Code copied' : 'Copy code block'}</span>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <Highlight
        code={formattedCode}
        language={safeLanguage}
        theme={themes.nightOwl}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              'flex overflow-x-auto bg-transparent p-4 font-mono text-[13px] leading-relaxed',
              className,
            )}
            style={style}
          >
            <code className="flex min-w-full flex-col gap-0">
              {tokens.map((line, lineIndex) => {
                const {
                  className: lineClassName,
                  key: _lineKey,
                  ...lineProps
                } = getLineProps({ line, key: lineIndex })
                return (
                  <span
                    key={`line-${lineIndex}`}
                    {...lineProps}
                    className={cn('inline-flex min-w-full gap-4', lineClassName)}
                  >
                    <span className="select-none text-right text-[11px] text-muted-foreground/70">
                      {lineIndex + 1}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap">
                      {line.map((token, tokenIndex) => {
                        const {
                          className: tokenClassName,
                          key: _tokenKey,
                          ...tokenProps
                        } = getTokenProps({ token, key: tokenIndex })
                        return (
                          <span
                            key={`token-${lineIndex}-${tokenIndex}`}
                            {...tokenProps}
                            className={tokenClassName}
                          />
                        )
                      })}
                    </span>
                  </span>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </figure>
  )
}
