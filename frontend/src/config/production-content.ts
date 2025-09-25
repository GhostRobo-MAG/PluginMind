import { siteConfig } from "@/config/site"
import type { BenefitCard } from "@/types/content"

// Production content configuration with original benefits data
function createProductionBenefitCards(): BenefitCard[] {
  return [
    {
      id: "1",
      eyebrow: "Incredible Time Saver",
      title: "Get a Head Start on Your Competitors",
      description: "Since everything is professionally configured and up to standards, you save a tremendous amount of time and effort, which you can now spend focusing on what really matters - core functionality, unique to your business.",
      stats: {
        primary: {
          value: "162.9k",
          label: "Last 7 Days Website Visits",
          sublabel: "23% Increase from Last Week",
        },
        secondary: {
          value: "132.7k",
          label: "Last 14 Days Website Visits",
          sublabel: "17% Increase from Last Week",
        },
      },
    },
    {
      id: "2",
      eyebrow: "Latest and Greatest in Tech",
      title: "Take Advantage of Modern Technologies",
      description: "We are constantly updating our templates to take advantage of the latest and greatest technologies, so you can be sure that your website is always up to date and as fast as possible.",
      image: "/images/benefits/3.jpeg",
    },
    {
      id: "3",
      eyebrow: "High Quality Implementation",
      title: "Know Everything Works As Expected",
      description: "We spent countless hours researching, exploring docs and testing the best way to implement the most important features. We have done the hard work so you don't have to.",
      image: "/images/benefits/2.jpeg",
    },
    {
      id: "4",
      eyebrow: "Flexibility and Support",
      title: "Easily Customize Every Single Detail",
      description: "With the help of our detailed documentation, you can now easily customize every single detail of the template. Should you need any help, we are a message away.",
      image: "/images/benefits/1.jpeg",
    },
  ]
}

const resolvers: Record<string, () => unknown> = {
  "landing.benefits.heading.prefix": () => "Why",
  "landing.benefits.heading.highlight": () => "Should You Care?",
  "landing.benefits.description": () => `Your competitors are already using ${siteConfig.name} and similar products, gaining time and competitive advantage. Don't get left behind!`,
  "landing.benefits.cards": () => createProductionBenefitCards(),
}

export function productionContentResolver(key: string): unknown {
  const resolver = resolvers[key]
  if (!resolver) return undefined

  if (!cache.has(key)) {
    cache.set(key, resolver())
  }
  return cache.get(key)
}

const cache = new Map<string, unknown>()