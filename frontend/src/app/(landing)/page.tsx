import { BenefitsSection } from "@/components/sections/benefits-section"
import { ContactSection } from "@/components/sections/contact-section"
import { FAQSection } from "@/components/sections/faq-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { HeroSection } from "@/components/sections/hero-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { TechSection } from "@/components/sections/tech-section"

export default function LandingPage(): JSX.Element {
  return (
    <div className="w-full">
      {/* Hero - Primary background */}
      <section className="section-primary pt-24 pb-16 md:pt-32 md:pb-24">
        <HeroSection />
      </section>

      {/* Tech - Secondary background */}
      <section className="section-secondary py-16 md:py-24">
        <TechSection />
      </section>

      {/* Benefits - Primary background */}
      <section className="section-primary py-16 md:py-24">
        <BenefitsSection />
      </section>

      {/* Features - Secondary background */}
      <section className="section-secondary py-16 md:py-24">
        <FeaturesSection />
      </section>

      {/* Pricing - Primary background */}
      <section className="section-primary py-16 md:py-24">
        <PricingSection />
      </section>

      {/* FAQ - Secondary background */}
      <section className="section-secondary py-16 md:py-24">
        <FAQSection />
      </section>

      {/* Newsletter - Tertiary background (special) */}
      <section className="section-tertiary py-16 md:py-24">
        <NewsletterSection />
      </section>

      {/* Contact - Primary background */}
      <section className="section-primary py-16 md:py-24">
        <ContactSection />
      </section>
    </div>
  )
}
