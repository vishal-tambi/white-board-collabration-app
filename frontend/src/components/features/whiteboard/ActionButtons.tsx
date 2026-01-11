import { Undo2, Redo2, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCanvasStore } from '@/stores/canvasStore'
import { toast } from 'sonner'

interface ActionButtonsProps {
  onDownload?: () => void
}

interface ActionConfig {
  icon: React.ReactNode
  label: string
  shortcut?: string
  onClick: () => void
  disabled: boolean
  variant?: 'default' | 'destructive'
}

/**
 * ActionButtons Component
 *
 * Undo, Redo, Clear and Download action buttons with tooltips.
 */
export function ActionButtons({ onDownload }: ActionButtonsProps) {
  const { undo, redo, clear, canUndo, canRedo, strokes } = useCanvasStore()

  const handleClear = () => {
    clear()
    toast.success('Canvas cleared')
  }

  const actions: ActionConfig[] = [
    {
      icon: <Undo2 className="size-4" />,
      label: 'Undo',
      shortcut: 'Ctrl+Z',
      onClick: undo,
      disabled: !canUndo(),
    },
    {
      icon: <Redo2 className="size-4" />,
      label: 'Redo',
      shortcut: 'Ctrl+Y',
      onClick: redo,
      disabled: !canRedo(),
    },
  ]

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1 p-2">
        {actions.map((action) => (
          <Tooltip key={action.label}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                disabled={action.disabled}
                className="size-9 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={action.label}
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex items-center gap-2">
              <span>{action.label}</span>
              {action.shortcut && (
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {action.shortcut}
                </kbd>
              )}
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

        {/* Clear button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              disabled={strokes.length === 0}
              className="size-9 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Clear canvas"
            >
              <Trash2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Clear canvas</TooltipContent>
        </Tooltip>

        {/* Download button */}
        {onDownload && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDownload}
                disabled={strokes.length === 0}
                className="size-9 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Download canvas"
              >
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="flex items-center gap-2">
              <span>Download</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                Ctrl+S
              </kbd>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
