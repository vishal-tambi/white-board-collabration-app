import { useToolbarStore } from '@/stores/toolbarStore'
import { ToolButton } from './ToolButton'
import { ColorPicker } from './ColorPicker'
import { SizeSlider } from './SizeSlider'
import { ActionButtons } from './ActionButtons'
import { BackgroundSelector } from './BackgroundSelector'
import { cn } from '@/lib/utils'
import type { ToolType } from '@/types'

interface ToolbarProps {
  className?: string
  onDownload?: () => void
}

// Tool groups for better organization
const toolGroups: { label: string; tools: ToolType[] }[] = [
  {
    label: 'Draw',
    tools: ['pen', 'eraser'],
  },
  {
    label: 'Shapes',
    tools: ['rectangle', 'circle', 'arrow', 'line'],
  },
  {
    label: 'Interact',
    tools: ['select', 'pan', 'note', 'laser'],
  },
]

/**
 * Toolbar Component
 *
 * Contains all drawing tools, color picker, size slider, and action buttons.
 * Tools are organized into logical groups: Draw, Shapes, and Interact.
 * Positioned on the left side on desktop, bottom on mobile.
 */
export function Toolbar({ className, onDownload }: ToolbarProps) {
  const { activeTool, setTool } = useToolbarStore()

  return (
    <div
      className={cn(
        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border rounded-xl shadow-lg',
        'flex flex-col max-h-[calc(100vh-6rem)] overflow-y-auto',
        className
      )}
    >
      {/* Tool groups */}
      {toolGroups.map((group, groupIndex) => (
        <div key={group.label}>
          <div className="flex flex-wrap items-center gap-1 p-2">
            {group.tools.map((tool) => (
              <ToolButton
                key={tool}
                tool={tool}
                isActive={activeTool === tool}
                onClick={() => setTool(tool)}
              />
            ))}
          </div>
          {/* Divider between groups (except after last group) */}
          {groupIndex < toolGroups.length - 1 && (
            <div className="border-b border-border" />
          )}
        </div>
      ))}

      {/* Divider before settings */}
      <div className="border-b border-border" />

      {/* Color picker */}
      <div className="border-b border-border">
        <ColorPicker />
      </div>

      {/* Size slider */}
      <div className="border-b border-border">
        <SizeSlider />
      </div>

      {/* Background selector */}
      <div className="border-b border-border">
        <BackgroundSelector />
      </div>

      {/* Action buttons */}
      <ActionButtons onDownload={onDownload} />
    </div>
  )
}
