import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useToolbarStore } from '@/stores/toolbarStore'
import { ToolButton } from './ToolButton'
import { ColorPicker } from './ColorPicker'
import { SizeSlider } from './SizeSlider'
import { ActionButtons } from './ActionButtons'
import type { ToolType } from '@/types'

interface MobileToolbarProps {
  onDownload?: () => void
}

const tools: ToolType[] = ['pen', 'eraser']

/**
 * MobileToolbar Component
 *
 * Slide-out drawer toolbar for mobile devices.
 * Uses Sheet component for touch-friendly interaction.
 */
export function MobileToolbar({ onDownload }: MobileToolbarProps) {
  const [open, setOpen] = useState(false)
  const { activeTool, setTool, strokeColor } = useToolbarStore()

  // Get current tool icon color
  const handleToolSelect = (tool: ToolType) => {
    setTool(tool)
    // Don't close on tool select - let user adjust settings too
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-4 right-4 z-50 size-14 rounded-full shadow-lg cursor-pointer"
          aria-label="Open toolbar"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="rounded-t-3xl pb-8">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center">Drawing Tools</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Tool selection */}
          <div className="flex justify-center gap-4">
            {tools.map((tool) => (
              <ToolButton
                key={tool}
                tool={tool}
                isActive={activeTool === tool}
                onClick={() => handleToolSelect(tool)}
              />
            ))}
          </div>

          {/* Color picker */}
          <div className="flex justify-center">
            <div className="bg-muted rounded-xl p-2">
              <ColorPicker />
            </div>
          </div>

          {/* Size slider */}
          <div className="max-w-xs mx-auto">
            <SizeSlider />
          </div>

          {/* Action buttons */}
          <div className="flex justify-center">
            <ActionButtons onDownload={onDownload} />
          </div>
        </div>

        {/* Current tool indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div
            className="size-4 rounded-full border-2 border-border"
            style={{
              backgroundColor: activeTool === 'eraser' ? '#fff' : strokeColor,
            }}
          />
          <span className="capitalize">{activeTool}</span>
        </div>
      </SheetContent>
    </Sheet>
  )
}
