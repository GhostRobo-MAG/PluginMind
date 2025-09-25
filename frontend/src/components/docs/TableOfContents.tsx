'use client'

import { useEffect, useMemo, useState } from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'

export type TocHeading = {
  id: string
  title: string
  level: number
}

type TableOfContentsProps = {
  headings: TocHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sanitizedHeadings = useMemo(
    () => headings.filter((heading) => heading.level >= 2 && heading.level <= 4),
    [headings],
  )

  useEffect(() => {
    if (sanitizedHeadings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop)[0]

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id)
        }
      },
      {
        rootMargin: '-100px 0px -70% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    )

    sanitizedHeadings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sanitizedHeadings])

  if (sanitizedHeadings.length === 0) return null

  return (
    <nav
      aria-label="Table of contents"
      className="hidden xl:block xl:w-64 xl:shrink-0"
    >
      <div className="sticky top-24 space-y-3 rounded-lg border border-border/70 bg-background/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        <ul className="space-y-1 text-sm">
          {sanitizedHeadings.map((heading) => (
            <li key={heading.id}>
              <Link
                href={`#${heading.id}`}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                  heading.level === 3 && 'pl-4 text-xs',
                  heading.level === 4 && 'pl-6 text-[11px]',
                  activeId === heading.id && 'bg-primary/10 text-primary',
                )}
              >
                <span className="truncate">{heading.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
