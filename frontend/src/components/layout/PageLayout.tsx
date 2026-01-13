import { Header } from './Header'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { SmoothScroll } from '@/components/common/SmoothScroll'

interface PageLayoutProps {
  children: ReactNode
  showHeader?: boolean
  headerVariant?: 'landing' | 'whiteboard'
  className?: string
}
export function PageLayout({
  children,
  showHeader = true,
  headerVariant = 'landing',
  className,
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen flex flex-col bg-background', className)}>
      <SmoothScroll />
      {showHeader && <Header variant={headerVariant} />}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  )
}
