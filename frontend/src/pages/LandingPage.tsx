import { PageLayout } from '@/components/layout/PageLayout'
import { Container } from '@/components/layout/Container'
import { Hero } from '@/components/features/landing/Hero'
import { ActionPanel } from '@/components/features/landing/ActionPanel'
import { CreateRoomCard } from '@/components/features/landing/CreateRoomCard'
import { JoinRoomCard } from '@/components/features/landing/JoinRoomCard'

/**
 * LandingPage
 *
 * Main entry point for the application.
 * Displays hero section with create/join room options.
 */
export function LandingPage() {
  return (
    <PageLayout>
      <Container>
        <Hero />
        <ActionPanel>
          <CreateRoomCard />
          <JoinRoomCard />
        </ActionPanel>
      </Container>

      {/* Footer */}
      <footer className="py-6 border-t border-border mt-auto">
        <Container>
          <p className="text-center text-sm text-muted-foreground">
            Built with React, TypeScript, and Canvas API
          </p>
        </Container>
      </footer>
    </PageLayout>
  )
}
