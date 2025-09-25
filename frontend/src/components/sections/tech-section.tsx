"use client"

import Link from "next/link"

import { techStack } from "@/data/tech-stack"
import { useContentValue } from "@/providers/content-provider"

import { Icons } from "@/components/icons"

export function TechSection(): JSX.Element {
  const techItems = useContentValue('landing.tech.items', techStack)
  return (
    <section id="tech-section" aria-label="tech section" className="w-full grid">
      <div
        className="container w-full max-w-3xl animate-fade-up opacity-0"
        style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
      >
        <div className="marquee px-2">
          <div className="marquee-track">
            {[...techItems, ...techItems].map((tech, idx) => {
              const Icon = Icons[tech.icon as keyof typeof Icons]
              return (
                <Link
                  key={`${tech.title}-${idx}`}
                  href={tech.href}
                  target="_blank"
                  rel="noreferer"
                  className="inline-block transition-opacity duration-200 ease-out hover:opacity-70"
                  aria-hidden={idx >= techItems.length}
                >
                  <Icon className="h-10 w-auto max-w-[160px]" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
