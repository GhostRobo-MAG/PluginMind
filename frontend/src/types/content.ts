export interface BenefitCardStats {
  primary: {
    value: string
    label: string
    sublabel: string
  }
  secondary?: {
    value: string
    label: string
    sublabel: string
  }
}

export interface BenefitCard {
  id: string
  eyebrow: string
  title: string
  description: string
  image?: string
  stats?: BenefitCardStats
}