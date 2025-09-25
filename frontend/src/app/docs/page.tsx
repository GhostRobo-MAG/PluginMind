import { DocArticle } from '@/components/docs/DocArticle'

import { buildBreadcrumbs } from './navigation'
import { compileDoc, readDocFrontmatter } from './mdx'

const OVERVIEW_SLUG = ['overview'] as const

export async function generateMetadata() {
  try {
    const frontmatter = await readDocFrontmatter([...OVERVIEW_SLUG])
    return {
      title: `${frontmatter.title} | YourApp Docs`,
      description: frontmatter.description,
    }
  } catch (error) {
    return {
      title: 'YourApp Documentation',
    }
  }
}

export default async function DocsIndexPage() {
  const doc = await compileDoc([...OVERVIEW_SLUG])
  const breadcrumbs = buildBreadcrumbs([...OVERVIEW_SLUG], doc.frontmatter)
  const showToc = doc.frontmatter.toc !== false

  return (
    <DocArticle
      description={doc.frontmatter.description}
      content={doc.content}
      headings={doc.headings}
      breadcrumbs={breadcrumbs}
      showTableOfContents={showToc}
    />
  )
}
