import { Header } from './Header'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  showHeader?: boolean
  headerVariant?: 'landing' | 'whiteboard'
  className?: string
}

/**
 * PageLayout Component
 *
 * Wraps pages with consistent layout structure.
 * Includes optional header and handles full-height layout.
 */
export function PageLayout({
  children,
  showHeader = true,
  headerVariant = 'landing',
  className,
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col bg-background', className)}>
      {showHeader && <Header variant={headerVariant} />}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
