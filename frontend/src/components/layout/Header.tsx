import { Link } from 'react-router'
import { PenLine } from 'lucide-react'
import { Container } from './Container'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { cn } from '@/lib/utils'

interface HeaderProps {
  variant?: 'landing' | 'whiteboard'
  className?: string
}

/**
 * Header Component
 *
 * Responsive header with logo, navigation, and theme toggle.
 * - 'landing' variant: Full header with navigation
 * - 'whiteboard' variant: Minimal header (used within whiteboard page)
 */
export function Header({ variant = 'landing', className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <Container>
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
          >
            <PenLine className="size-6 text-primary" />
            <span className="hidden sm:inline">Whiteboard</span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {variant === 'landing' && (
              <nav className="hidden md:flex items-center gap-4 mr-4">
                {/* Future navigation links can go here */}
              </nav>
            )}
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  )
}
