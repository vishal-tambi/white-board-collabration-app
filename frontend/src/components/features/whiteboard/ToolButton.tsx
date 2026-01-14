import {
  Pen,
  Eraser,
  MousePointer2,
  Hand,
  Square,
  Circle,
  ArrowRight,
  Minus,
  StickyNote,
  Pointer,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ToolType } from '@/types'

interface ToolButtonProps {
  tool: ToolType
  isActive: boolean
  onClick: () => void
  disabled?: boolean
}

const toolIcons: Record<ToolType, React.ReactNode> = {
  pen: <Pen className="size-5" />,
  eraser: <Eraser className="size-5" />,
  select: <MousePointer2 className="size-5" />,
  pan: <Hand className="size-5" />,
  rectangle: <Square className="size-5" />,
  circle: <Circle className="size-5" />,
  arrow: <ArrowRight className="size-5" />,
  line: <Minus className="size-5" />,
  note: <StickyNote className="size-5" />,
  laser: <Pointer className="size-5" />,
}

const toolLabels: Record<ToolType, string> = {
  pen: 'Pen',
  eraser: 'Eraser',
  select: 'Select',
  pan: 'Pan',
  rectangle: 'Rectangle',
  circle: 'Circle',
  arrow: 'Arrow',
  line: 'Line',
  note: 'Sticky Note',
  laser: 'Laser Pointer',
}

const toolShortcuts: Record<ToolType, string> = {
  pen: 'P',
  eraser: 'E',
  select: 'V',
  pan: 'H',
  rectangle: 'R',
  circle: 'C',
  arrow: 'A',
  line: 'L',
  note: 'N',
  laser: 'S',
}

/**
 * ToolButton Component
 *
 * Individual tool button with icon, tooltip, and active state.
 * Includes keyboard shortcut hint in tooltip.
 */
export function ToolButton({
  tool,
  isActive,
  onClick,
  disabled,
}: ToolButtonProps) {
  const icon = toolIcons[tool]
  if (!icon) return null

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? 'default' : 'ghost'}
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'size-10 cursor-pointer transition-all',
              isActive && 'bg-primary text-primary-foreground shadow-md',
              !isActive && 'hover:bg-muted'
            )}
            aria-label={`${toolLabels[tool]} tool`}
            aria-pressed={isActive}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span>{toolLabels[tool]}</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            {toolShortcuts[tool]}
          </kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
