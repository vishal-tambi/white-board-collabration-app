import { useToolbarStore } from '@/stores/toolbarStore'
import { ToolButton } from './ToolButton'
import { ColorPicker } from './ColorPicker'
import { SizeSlider } from './SizeSlider'
import { ActionButtons } from './ActionButtons'
import { cn } from '@/lib/utils'
import type { ToolType } from '@/types'

interface ToolbarProps {
  className?: string
  onDownload?: () => void
}

const tools: ToolType[] = ['pen', 'eraser']

/**
 * Toolbar Component
 *
 * Contains all drawing tools, color picker, size slider, and action buttons.
 * Positioned on the left side on desktop, bottom on mobile.
 */
export function Toolbar({ className, onDownload }: ToolbarProps) {
  const { activeTool, setTool } = useToolbarStore()

  return (
    <div
      className={cn(
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-xl shadow-lg',
        'flex flex-col',
        className
      )}
    >
      {/* Tool selection */}
      <div className="flex items-center gap-1 p-2 border-b border-border">
        {tools.map((tool) => (
          <ToolButton
            key={tool}
            tool={tool}
            isActive={activeTool === tool}
            onClick={() => setTool(tool)}
          />
        ))}
      </div>

      {/* Color picker */}
      <div className="border-b border-border">
        <ColorPicker />
      </div>

      {/* Size slider */}
      <div className="border-b border-border">
        <SizeSlider />
      </div>

      {/* Action buttons */}
      <ActionButtons onDownload={onDownload} />
    </div>
  )
}
