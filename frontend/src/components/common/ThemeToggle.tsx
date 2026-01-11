import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'

/**
 * ThemeToggle Component
 *
 * Cycles through theme options: light → dark → system
 * Displays appropriate icon based on current theme setting
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = [
      'light',
      'dark',
      'system',
    ]
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className="size-5" />
    }
    return resolvedTheme === 'dark' ? (
      <Moon className="size-5" />
    ) : (
      <Sun className="size-5" />
    )
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system mode'
      case 'system':
        return 'Switch to light mode'
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={getLabel()}
      title={getLabel()}
      className="cursor-pointer"
    >
      {getIcon()}
    </Button>
  )
}
