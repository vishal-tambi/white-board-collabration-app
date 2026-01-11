import { useToolbarStore } from '@/stores/toolbarStore'
import { PRESET_COLORS } from '@/types'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

/**
 * ColorPicker Component
 *
 * Grid of preset colors for quick selection.
 */
export function ColorPicker() {
  const { strokeColor, setColor, activeTool } = useToolbarStore()

  // Disable color picker when using eraser
  const isDisabled = activeTool === 'eraser'

  return (
    <div
      className={cn(
        'grid grid-cols-5 gap-1.5 p-2',
        isDisabled && 'opacity-50 pointer-events-none'
      )}
    >
      {PRESET_COLORS.map((color) => {
        const isActive = strokeColor === color
        const isWhite = color === '#FFFFFF'

        return (
          <button
            key={color}
            onClick={() => setColor(color)}
            disabled={isDisabled}
            className={cn(
              'size-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer',
              isWhite && 'border border-border',
              isActive && 'ring-2 ring-primary ring-offset-2'
            )}
            style={{ backgroundColor: color }}
            title={color}
            aria-label={`Select color ${color}`}
            aria-pressed={isActive}
          >
            {isActive && (
              <Check
                className={cn(
                  'size-4 mx-auto',
                  isWhite ? 'text-gray-600' : 'text-white'
                )}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
