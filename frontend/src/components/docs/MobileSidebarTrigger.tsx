'use client'

import { useState } from 'react'

import { AlignLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

import type { DocSidebarSection } from './Sidebar'
import { Sidebar } from './Sidebar'

type MobileSidebarTriggerProps = {
  sections: DocSidebarSection[]
}

export function MobileSidebarTrigger({ sections }: MobileSidebarTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={open}
          aria-controls="docs-mobile-sidebar"
          aria-label="Toggle documentation navigation"
          className="flex items-center gap-2 lg:hidden"
        >
          <AlignLeft className="h-4 w-4" aria-hidden="true" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        id="docs-mobile-sidebar"
        className="w-full max-w-xs overflow-y-auto border-r bg-background/95 p-6"
      >
        <Sidebar sections={sections} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
