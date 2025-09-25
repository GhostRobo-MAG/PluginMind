import type { ReactNode } from 'react'

import { Breadcrumbs } from '@/components/docs/Breadcrumbs'
import { TableOfContents, type TocHeading } from '@/components/docs/TableOfContents'

type DocArticleProps = {
  description?: string
  content: ReactNode
  headings: TocHeading[]
  breadcrumbs: { label: string; href?: string }[]
  showTableOfContents?: boolean
}

export function DocArticle({
  description,
  content,
  headings,
  breadcrumbs,
  showTableOfContents = true,
}: DocArticleProps) {
  const shouldShowToc = showTableOfContents && headings.length > 0

  return (
    <div className="flex flex-col gap-10 xl:flex-row">
      <div className="min-w-0 flex-1 space-y-8">
        <Breadcrumbs segments={breadcrumbs} />
        {description ? (
          <header className="space-y-3">
            <p className="max-w-2xl text-base text-muted-foreground">{description}</p>
          </header>
        ) : null}
        <article className="prose prose-slate max-w-none dark:prose-invert prose-blockquote:border-l-primary prose-headings:scroll-mt-28 prose-pre:bg-transparent prose-pre:p-0 prose-code:text-sm">
          {content}
        </article>
      </div>
      {shouldShowToc ? <TableOfContents headings={headings} /> : null}
    </div>
  )
}
