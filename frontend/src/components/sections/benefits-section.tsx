"use client"

import Image from "next/image"
import Balancer from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { useContentValue } from "@/providers/content-provider"
import type { BenefitCard } from "@/types/content"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function BenefitsSection(): JSX.Element {
  const headingPrefix = useContentValue('landing.benefits.heading.prefix', 'Why')
  const headingHighlight = useContentValue('landing.benefits.heading.highlight', 'Should You Care?')
  const description = useContentValue('landing.benefits.description', `Your competitors are already using ${siteConfig.name} and similar products, gaining time and competitive advantage. Don't get left behind!`)
  const benefitCards = useContentValue<BenefitCard[]>('landing.benefits.cards', [])
  return (
    <section id="about-section" aria-label="about section" className="w-full">
      <div className="container grid max-w-6xl justify-center gap-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-urbanist text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <Balancer>
              {headingPrefix}{" "}
              <span className="relative bg-gradient-to-r from-primary to-accent bg-clip-text font-extrabold text-transparent">
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

        <div className="grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {benefitCards.length > 0 ? (
            <>
              <div className="space-y-4 md:mt-20 md:space-y-6">
                {benefitCards.slice(0, 2).map((card) => (
                  <Card
                    key={card.id}
                    className="h-fit bg-secondary/50 border border-border transition-all duration-1000 ease-out md:hover:-translate-y-3"
                  >
                    <CardHeader>
                      <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                        {card.eyebrow}
                      </CardDescription>
                      <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                        <Balancer>{card.title}</Balancer>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-base leading-8 tracking-wide text-muted-foreground">
                        <Balancer>{card.description}</Balancer>
                      </p>
                      {card.stats && (
                        <div>
                          <div className="pr-8">
                            <div className="relative z-10 flex flex-col gap-3 rounded-xl bg-background p-4 text-center shadow-xl">
                              <p className="text-3xl font-bold text-primary">
                                {card.stats.primary.value}
                              </p>
                              <p className="text-xs font-bold tracking-wide text-accent">
                                {card.stats.primary.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {card.stats.primary.sublabel}
                              </p>
                            </div>
                          </div>
                          {card.stats.secondary && (
                            <div className="-mt-14 pl-8">
                              <div className="flex flex-col gap-3 rounded-xl bg-background p-4 text-center opacity-30 shadow-xl">
                                <p className="text-3xl font-bold">{card.stats.secondary.value}</p>
                                <p className="text-xs font-bold tracking-wide">
                                  {card.stats.secondary.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {card.stats.secondary.sublabel}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {card.image && !card.stats && (
                        <Image
                          width={600}
                          height={400}
                          alt={card.title}
                          src={card.image}
                          className="overflow-hidden rounded-b-xl"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="space-y-4 md:space-y-6">
                {benefitCards.slice(2, 4).map((card) => (
                  <Card
                    key={card.id}
                    className="h-fit bg-secondary/50 border border-border transition-all duration-1000 ease-out md:hover:-translate-y-3"
                  >
                    <CardHeader>
                      <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                        {card.eyebrow}
                      </CardDescription>
                      <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                        <Balancer>{card.title}</Balancer>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 p-0">
                      <p className="px-4 text-base leading-8 tracking-wide text-muted-foreground">
                        <Balancer>{card.description}</Balancer>
                      </p>
                      {card.image && (
                        <Image
                          width={600}
                          height={400}
                          alt={card.title}
                          src={card.image}
                          className="overflow-hidden rounded-b-xl"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 md:mt-20 md:space-y-6">
                <Card className="h-fit bg-secondary/50 border border-border transition-all duration-1000 ease-out md:hover:-translate-y-3">
                  <CardHeader>
                    <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                      Your Feature Category Here
                    </CardDescription>
                    <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                      <Balancer>Your Feature Title Here</Balancer>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-base leading-8 tracking-wide text-muted-foreground">
                      <Balancer>
                        Description of your feature benefit goes here. Explain how this helps your users and why it matters.
                      </Balancer>
                    </p>
                  </CardContent>
                </Card>
                <Card className="h-fit bg-secondary/50 border border-border transition-all duration-1000 ease-out md:hover:-translate-y-3">
                  <CardHeader>
                    <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                      Another Feature Category
                    </CardDescription>
                    <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                      <Balancer>Another Feature Title</Balancer>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-0">
                    <p className="px-4 text-base leading-8 tracking-wide text-muted-foreground">
                      <Balancer>
                        Another feature description showcasing your product capabilities and benefits.
                      </Balancer>
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4 md:space-y-6">
                <Card className="h-fit bg-secondary/50 border border-border transition-all duration-1000 ease-out md:hover:-translate-y-3">
                  <CardHeader>
                    <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                      Third Feature Category
                    </CardDescription>
                    <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                      <Balancer>Third Feature Title</Balancer>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-0">
                    <p className="px-4 text-base leading-8 tracking-wide text-muted-foreground">
                      <Balancer>
                        Third feature description highlighting key product advantages.
                      </Balancer>
                    </p>
                  </CardContent>
                </Card>
                <Card className="h-fit bg-secondary/50 border border-border transition-all duration-1000 ease-out md:hover:-translate-y-3">
                  <CardHeader>
                    <CardDescription className="py-2 text-base font-medium tracking-wide text-muted-foreground">
                      Fourth Feature Category
                    </CardDescription>
                    <CardTitle className="font-urbanist text-3xl font-black tracking-wide">
                      <Balancer>Fourth Feature Title</Balancer>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-0">
                    <p className="px-4 text-base leading-8 tracking-wide text-muted-foreground">
                      <Balancer>
                        Fourth feature description explaining the value proposition.
                      </Balancer>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
