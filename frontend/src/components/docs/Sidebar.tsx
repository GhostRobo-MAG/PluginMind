'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

export type DocSidebarItem = {
  title: string
  href: string
  slug: string[]
  children?: DocSidebarItem[]
  level?: number
}

export type DocSidebarSection = {
  id: string
  title: string
  description?: string
  items: DocSidebarItem[]
}

type SidebarProps = {
  sections: DocSidebarSection[]
  onNavigate?: () => void
}

export function Sidebar({ sections, onNavigate }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  const renderItems = (items: DocSidebarItem[], depth = 0) => (
    <ul className={cn('space-y-1', depth > 0 && 'mt-1 border-l border-border/40 pl-3')}
        role={depth === 0 ? 'list' : 'group'}>
      {items.map((item) => {
        const active = isActive(item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center justify-between gap-2 rounded-md py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                item.level && item.level > 1
                  ? item.level === 2
                    ? 'pl-6 pr-2'
                    : item.level === 3
                      ? 'pl-8 pr-2'
                      : 'pl-10 pr-2'
                  : 'px-2',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span className="truncate">{item.title}</span>
            </Link>
            {item.children && item.children.length > 0 ? renderItems(item.children, depth + 1) : null}
          </li>
        )
      })}
    </ul>
  )

  return (
    <nav aria-label="Documentation navigation" className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <div className="px-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </p>
            {section.description ? (
              <p className="mt-1 text-xs text-muted-foreground/80">
                {section.description}
              </p>
            ) : null}
          </div>
          {renderItems(section.items)}
        </div>
      ))}
    </nav>
  )
}
