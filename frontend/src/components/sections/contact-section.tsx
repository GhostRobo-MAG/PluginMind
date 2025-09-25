"use client"

import Balancer from "react-wrap-balancer"

import { ContactForm } from "@/components/forms/contact-form"
import { useContentValue } from "@/providers/content-provider"

export function ContactSection(): JSX.Element {
  const headingPrefix = useContentValue('landing.contact.heading.prefix', 'Let\'s')
  const headingHighlight = useContentValue('landing.contact.heading.highlight', 'Get in Touch')
  const description = useContentValue('landing.contact.description', 'Feel free to email us with any questions you might have. While we are always happy to help, please keep in mind that this is a free product and we cannot guarantee any response times. We would also love to know your feedback!')
  return (
    <section
      id="contact-section"
      aria-label="contact section"
      className="w-full"
    >
      <div className="container grid max-w-4xl grid-cols-1 justify-center gap-8 md:gap-16">
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

        <ContactForm />
      </div>
    </section>
  )
}
