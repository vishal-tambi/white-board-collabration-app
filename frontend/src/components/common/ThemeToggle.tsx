import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'

/**
 * ThemeToggle Component
 *
 * Toggles between light and dark theme modes
 * Displays appropriate icon based on current theme setting
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const getLabel = () => {
    return resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={getLabel()}
      title={getLabel()}
      className="cursor-pointer"
    >
      {resolvedTheme === 'dark' ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
    </Button>
  )
}
