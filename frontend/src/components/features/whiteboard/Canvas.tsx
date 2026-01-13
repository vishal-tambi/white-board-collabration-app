import { useEffect } from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import { cn } from '@/lib/utils'
import type { Stroke, Point } from '@/types'

interface CanvasProps {
  className?: string
  onStrokeStart?: (stroke: Stroke) => void
  onStrokeUpdate?: (strokeId: string, point: Point) => void
  onStrokeEnd?: (strokeId: string) => void
}

/**
 * Canvas Component
 *
 * Main drawing surface for the whiteboard.
 * Handles all pointer interactions for drawing.
 */
export function Canvas({
  className,
  onStrokeStart,
  onStrokeUpdate,
  onStrokeEnd
}: CanvasProps) {
  const {
    canvasRef,
    initCanvas,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    getCursorStyle,
  } = useCanvas({
    onStrokeStart,
    onStrokeUpdate,
    onStrokeEnd,
  })

  // Initialize canvas on mount
  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'w-full h-full touch-none', // touch-none prevents scrolling while drawing
        className
      )}
      style={{ cursor: getCursorStyle() }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerUp}
    />
  )
}

