import type { DocSidebarItem, DocSidebarSection } from '@/components/docs/Sidebar'

import { SIDEBAR_SECTIONS, type SidebarItemConfig, type SidebarSectionConfig } from './_sidebar'
import type { DocFrontmatter } from './mdx'
import { getAllDocEntries } from './mdx'

type DocEntry = {
  slug: string[]
  frontmatter: DocFrontmatter
  originalSegments: string[]
}

const slugKey = (slug: string[]) => slug.join('/')

const matchesSection = (entry: DocEntry, match: string | string[]): boolean => {
  const targets = Array.isArray(match) ? match : [match]
  const firstSegment = entry.slug[0]

  return targets.includes(firstSegment ?? '')
}

const buildSidebarItem = (entry: DocEntry, override?: SidebarItemConfig['title']): DocSidebarItem => {
  const title = override ?? entry.frontmatter.sidebarLabel ?? entry.frontmatter.title

  return {
    title,
    href: `/docs/${entry.slug.join('/')}`,
    slug: entry.slug,
    level: entry.slug.length,
  }
}

const sortEntries = (a: DocEntry, b: DocEntry) => {
  const orderA = a.frontmatter.order ?? Number.POSITIVE_INFINITY
  const orderB = b.frontmatter.order ?? Number.POSITIVE_INFINITY

  if (orderA !== orderB) {
    return orderA - orderB
  }

  return a.frontmatter.title.localeCompare(b.frontmatter.title)
}

export async function getSidebarSections(): Promise<DocSidebarSection[]> {
  const entries = (await getAllDocEntries()).filter((entry) => !entry.frontmatter.hideInSidebar)
  const entryMap = new Map(entries.map((entry) => [slugKey(entry.slug), entry]))
  const consumed = new Set<string>()

  const sections: DocSidebarSection[] = []

  for (const sectionConfig of SIDEBAR_SECTIONS) {
    const sectionEntries = entries.filter((entry) => matchesSection(entry, sectionConfig.match))

    if (sectionEntries.length === 0) continue

    const items: DocSidebarItem[] = []

    if (sectionConfig.items?.length) {
      for (const itemConfig of sectionConfig.items) {
        const entry = entryMap.get(slugKey(itemConfig.slug))
        if (!entry) continue
        consumed.add(slugKey(entry.slug))
        items.push(buildSidebarItem(entry, itemConfig.title))
      }
    }

    const residual = sectionEntries
      .filter((entry) => !consumed.has(slugKey(entry.slug)))
      .sort(sortEntries)
      .map((entry) => {
        consumed.add(slugKey(entry.slug))
        return buildSidebarItem(entry)
      })

    items.push(...residual)

    if (items.length > 0) {
      sections.push({
        id: sectionConfig.id,
        title: sectionConfig.title,
        description: sectionConfig.description,
        items,
      })
    }
  }

  const remaining = entries.filter((entry) => !consumed.has(slugKey(entry.slug)))

  if (remaining.length > 0) {
    sections.push({
      id: 'additional',
      title: 'Additional Docs',
      items: remaining.sort(sortEntries).map((entry) => buildSidebarItem(entry)),
    })
  }

  return sections
}

export function buildBreadcrumbs(slug: string[], frontmatter: DocFrontmatter) {
  const segments = [
    { label: 'Docs', href: '/docs' },
    ...slug.map((segment, index) => {
      const href = `/docs/${slug.slice(0, index + 1).join('/')}`

      if (index === slug.length - 1) {
        return { label: frontmatter.title, href: undefined }
      }

      const label = segment
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')

      return { label, href }
    }),
  ]

  return segments
}
