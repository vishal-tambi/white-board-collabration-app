import { PageLayout } from '@/components/layout/PageLayout'
import { Hero } from '@/components/features/landing/v2/Hero'
import { BentoGrid } from '@/components/features/landing/v2/BentoGrid'
import { ProcessSection } from '@/components/features/landing/v2/ProcessSection'
import { TestimonialsSection } from '@/components/features/landing/v2/TestimonialsSection'
import { StatsSection } from '@/components/features/landing/v2/StatsSection'
import { Footer } from '@/components/features/landing/v2/Footer'

/**
 * LandingPage
 *
 * Main entry point for the application.
 * Displays hero section with create/join room options.
 */
export function LandingPage() {
  return (
    <PageLayout>
      <Hero />
      <BentoGrid />
      <ProcessSection />
      <TestimonialsSection />
      <StatsSection />
      <Footer />
    </PageLayout>
  )
}
