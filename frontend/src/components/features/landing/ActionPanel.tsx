import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ActionPanelProps {
  children: ReactNode
  className?: string
}

/**
 * ActionPanel Component
 *
 * Container for the create/join room cards.
 * Responsive grid layout: stacked on mobile, side-by-side on larger screens.
 */
export function ActionPanel({ children, className }: ActionPanelProps) {
  return (
    <section className={cn('py-8 md:py-12', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto px-4">
        {children}
      </div>
    </section>
  )
}
