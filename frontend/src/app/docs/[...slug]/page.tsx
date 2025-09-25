import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DocArticle } from '@/components/docs/DocArticle'

import { buildBreadcrumbs } from '../navigation'
import { compileDoc, getAllDocSlugs, readDocFrontmatter } from '../mdx'

type DocPageProps = {
  params: {
    slug: string[]
  }
}

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const slug = params.slug ?? []

  try {
    const frontmatter = await readDocFrontmatter(slug)
    return {
      title: `${frontmatter.title} | PluginMind Docs`,
      description: frontmatter.description,
    }
  } catch (error) {
    return {
      title: 'Documentation | PluginMind',
    }
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const slug = params.slug ?? []

  if (slug.length === 0) {
    return notFound()
  }

  let doc: Awaited<ReturnType<typeof compileDoc>>

  try {
    doc = await compileDoc(slug)
  } catch (error) {
    return notFound()
  }

  const breadcrumbs = buildBreadcrumbs(slug, doc.frontmatter)
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
