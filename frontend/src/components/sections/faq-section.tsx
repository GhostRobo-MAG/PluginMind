"use client"

import * as React from "react"
import Link from "next/link"
import Balancer from "react-wrap-balancer"

import { frequentlyAskedQuestions } from "@/data/frequently-asked-questions"
import { useContentValue } from "@/providers/content-provider"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
  const heading = useContentValue('landing.faq.heading', 'Frequently Asked')
  const highlight = useContentValue('landing.faq.highlight', 'Questions')
  const description = useContentValue('landing.faq.description', 'Find the answers to the most common questions about our product. Feel free to email us if you still couldn\'t find what you were looking for.')
  const contactLink = useContentValue('landing.faq.contactLink', 'email us')
  const faqItems = useContentValue('landing.faq.items', frequentlyAskedQuestions)
  return (
    <section id="faq-section" aria-label="faq section" className="w-full">
      <div className="container grid max-w-6xl gap-8 md:gap-16">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              {heading}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {highlight}
              </span>
            </Balancer>
          </h2>
          <h3 className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            <Balancer>
              {description.split('email us').map((part, index) =>
                index === 0 ? part :
                <React.Fragment key={index}>
                  <Link
                    href="#contact-section"
                    className="font-semibold text-foreground underline-offset-4 transition-all hover:underline"
                  >
                    {contactLink}
                  </Link>
                  {part}
                </React.Fragment>
              )}
            </Balancer>
          </h3>
        </div>

        <div className="grid gap-4 sm:gap-6 md:gap-8">
          {faqItems.map((item) => (
            <Accordion key={item.question} type="single" collapsible>
              <AccordionItem value={item.question}>
                <AccordionTrigger className="sm:text-xl sm:leading-8">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground sm:text-lg sm:leading-8">
                  <Balancer>{item.answer}</Balancer>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  )
}
