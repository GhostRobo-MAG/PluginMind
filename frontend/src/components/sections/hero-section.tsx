"use client"

import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { useContentValue } from "@/providers/content-provider"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { TerminalWindow } from "@/components/ui/terminal-window"
import { PluginMindAsciiLogo } from "@/components/ui/ascii-art"
import { TerminalPrompt, StatusIndicator } from "@/components/ui/terminal-prompt"

export function HeroSection() {
  const badgeText = useContentValue('landing.hero.badge', 'Production-Ready AI SaaS Template')
  const heading = useContentValue('landing.hero.heading', 'Build Production AI SaaS with')
  const highlight = useContentValue('landing.hero.highlight', 'YourApp')
  const subheading = useContentValue('landing.hero.subheading', 'Transform your AI idea into production-ready SaaS. Complete template with FastAPI backend, plugin architecture, authentication, and comprehensive testing suite.')
  const terminalCommand = useContentValue('landing.hero.terminal.command', 'npm create your-ai-app')
  const terminalLines = useContentValue('landing.hero.terminal.lines', [
    { text: '✓ Creating production-ready AI SaaS...', tone: 'success' },
    { text: '✓ FastAPI backend initialized', tone: 'success' },
    { text: '✓ Plugin architecture configured', tone: 'success' },
    { text: '✓ 107+ tests passing', tone: 'success' },
    { text: 'Ready to deploy! 🚀', tone: 'info' }
  ])
  const primaryCta = useContentValue('landing.hero.cta.primary', { href: '/ai', label: 'Try Demo' })
  const secondaryCta = useContentValue('landing.hero.cta.secondary', { href: '/docs', label: 'Documentation' })

  return (
    <section
      id="hero-section"
      aria-label="hero section"
      className="w-full"
    >
      <div className="container flex flex-col items-center gap-8 text-center">
        <Badge
          variant="outline"
          aria-hidden="true"
          className="rounded-md px-3.5 py-1.5 text-sm transition-all duration-1000 ease-out hover:opacity-80 md:text-base border-primary/20 bg-primary/5"
        >
          <StatusIndicator status="online" className="mr-2" />
          {badgeText}
        </Badge>

        {/* Terminal Window with ASCII Art */}
        <div className="w-full max-w-4xl animate-fade-up">
          <TerminalWindow title="YourApp Terminal" className="mx-auto">
            <div className="space-y-4">
              <PluginMindAsciiLogo />

              <div className="space-y-2 text-left">
                <TerminalPrompt user="developer" host="yourapp" path="~/projects">
                  {terminalCommand}
                </TerminalPrompt>
                {terminalLines.map((line, index) => (
                  <div
                    key={index}
                    className={
                      line.tone === 'success'
                        ? "text-green-600 dark:text-green-400"
                        : line.tone === 'info'
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground"
                    }
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          </TerminalWindow>
        </div>

        <h1 className="animate-fade-up font-heading text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <Balancer>
            {heading}{" "}
            <span className="bg-gradient-to-r from-primary to-terminal-text-accent bg-clip-text font-bold text-transparent">
              {highlight}
            </span>
          </Balancer>
        </h1>

        <h3 className="max-w-2xl animate-fade-up text-muted-foreground sm:text-xl sm:leading-8">
          <Balancer>
            {subheading}
          </Balancer>
        </h3>

        <div className="z-10 flex animate-fade-up flex-col justify-center gap-4 sm:flex-row">
          <Link
            href={primaryCta.href}
            className={cn(
              buttonVariants({ size: "lg" }),
              "transition-all duration-300 ease-out md:hover:-translate-y-1 bg-primary hover:bg-primary/90"
            )}
          >
            <Icons.rocket className="mr-2 size-4" />
            {primaryCta.label}
          </Link>

          <Link
            href={secondaryCta.href}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "transition-all duration-300 ease-out md:hover:-translate-y-1 border-primary/20 hover:bg-primary/5"
            )}
          >
            <Icons.dashboard className="mr-2 size-4" />
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
