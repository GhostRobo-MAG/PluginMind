export interface NavItem {
  title: string
  href: string
  disabled?: boolean
}

export interface NavItemFooter {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export interface BlogPostParamsProps {
  params: {
    slug: string[]
  }
}

export interface PricingPlan {
  id: "basic" | "standard" | "premium"
  name: string
  description: string
  features: string[]
  limitations: string[]
  stripePriceId: string
  prices: {
    monthly: number
    yearly: number
  }
  stripeIds: {
    monthly?: string
    yearly?: string
  }
}

export interface UserSubscriptionPlan extends SubscriptionPlan {
  stripeSubscriptionId?: string | null
  stripeCurrentPeriodEnd?: string | null
  stripeCustomerId?: string | null
  isSubscribed: boolean
  isCanceled: boolean
  isActive: boolean
}

export interface FrequentlyAskedQuestion {
  question: string
  answer: string
}

export interface Feature {
  title: string
  description: string
  image: string
  icon?: string
  category?: string
  details?: string[]
  codeExample?: string
  diagram?: string
}

export interface Testimonial {
  title: string
  body: string
  name: string
  role: string
  avatar: string
}
