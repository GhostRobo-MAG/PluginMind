import * as React from "react"

import { Footer } from "@/components/nav/footer"
import { Header } from "@/components/nav/header"
import { ProductionContentProvider } from "@/providers/ProductionContentProvider"

interface LandingLayoutProps {
  children: React.ReactNode
}

export default function LandingLayout({
  children,
}: LandingLayoutProps): JSX.Element {
  return (
    <ProductionContentProvider>
      <div className="flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ProductionContentProvider>
  )
}
