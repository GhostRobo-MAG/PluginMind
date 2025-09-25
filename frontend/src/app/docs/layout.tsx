import type { ReactNode } from 'react'

import { MobileSidebarTrigger } from '@/components/docs/MobileSidebarTrigger'
import { Sidebar } from '@/components/docs/Sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Footer } from '@/components/nav/footer'
import { Header } from '@/components/nav/header'

import { getSidebarSections } from './navigation'

export const metadata = {
  title: 'Documentation | PluginMind',
  description: 'Modular documentation hub for PluginMind with guides, architecture, and API references.',
}

type DocsLayoutProps = {
  children: ReactNode
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  const sections = await getSidebarSections()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto flex flex-col gap-8 px-4 py-10 lg:flex-row lg:gap-12">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24">
              <ScrollArea className="h-[calc(100vh-6rem)] rounded-lg border border-border/80 bg-background/95 shadow-sm">
                <div className="px-4 pb-4 pr-5">
                  <Sidebar sections={sections} />
                </div>
              </ScrollArea>
            </div>
          </aside>
          <div className="flex-1 min-w-0 lg:max-w-3xl xl:max-w-4xl">
            <div className="mb-6 flex items-center justify-between lg:hidden">
              <MobileSidebarTrigger sections={sections} />
            </div>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
