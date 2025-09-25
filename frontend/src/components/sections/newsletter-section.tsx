"use client"

import Balancer from "react-wrap-balancer"

import { NewsletterSignUpForm } from "@/components/forms/newsletter-signup-form"
import { useContentValue } from "@/providers/content-provider"

export function NewsletterSection(): JSX.Element {
  const headingPrefix = useContentValue('landing.newsletter.heading.prefix', 'Sing Up to')
  const headingHighlight = useContentValue('landing.newsletter.heading.highlight', 'Our Newsletter')
  const description = useContentValue('landing.newsletter.description', 'Never miss a thing with our newsletter. We will send you updates on major released or changes to the product. We will never spam you.')
  return (
    <section
      id="newsletter-section"
      aria-label="newsletter section"
      className="w-full"
    >
      <div className="container flex max-w-6xl flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              {headingPrefix}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {headingHighlight}
              </span>
            </Balancer>
          </h2>
          <h3 className="max-w-2xl text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              {description}
            </Balancer>
          </h3>
        </div>

        <div className="w-full max-w-lg md:max-w-xl">
          <NewsletterSignUpForm />
        </div>
      </div>
    </section>
  )
}
