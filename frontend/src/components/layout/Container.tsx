import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
}

/**
 * Container Component
 *
 * Responsive max-width wrapper with horizontal padding.
 * Centers content and provides consistent spacing.
 */
export function Container({
  children,
  className,
  size = 'xl',
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  )
}
