import Link from 'next/link'

import { ChevronRight } from 'lucide-react'

type BreadcrumbSegment = {
  label: string
  href?: string
}

type BreadcrumbsProps = {
  segments: BreadcrumbSegment[]
}

export function Breadcrumbs({ segments }: BreadcrumbsProps) {
  if (segments.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-muted-foreground"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          return (
            <li key={`${segment.label}-${index}`} className="flex items-center gap-1">
              {segment.href && !isLast ? (
                <Link
                  href={segment.href}
                  className="rounded-md px-1 py-0.5 transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {segment.label}
                </Link>
              ) : (
                <span className="px-1 text-foreground">{segment.label}</span>
              )}
              {!isLast ? (
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
