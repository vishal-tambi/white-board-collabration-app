import { useEffect, useCallback, useRef } from 'react'
import { useCanvas } from '@/hooks/useCanvas'
import { useBackgroundStore } from '@/stores/backgroundStore'
import { useToolbarStore } from '@/stores/toolbarStore'
import { useElementsStore } from '@/stores/elementsStore'
import { BackgroundPattern } from './BackgroundPattern'
import { StickyNote } from './StickyNote'
import { drawShape } from '@/utils/shapes'
import { getPointFromEvent } from '@/utils/canvas'
import { cn } from '@/lib/utils'
import type { Stroke, Point } from '@/types'

interface CanvasProps {
  className?: string
  onStrokeStart?: (stroke: Stroke) => void
  onStrokeUpdate?: (strokeId: string, point: Point) => void
  onStrokeEnd?: (strokeId: string) => void
}

/**
 * Enhanced Canvas Component
 *
 * Comprehensive whiteboard canvas supporting:
 * - Pen & Eraser (via useCanvas hook)
 * - Shapes (rectangle, circle, arrow, line)
 * - Sticky Notes (draggable, editable)
 * - Laser Pointer (temporary trails)
 * - Selection tool
 */
export function Canvas({
  className,
  onStrokeStart,
  onStrokeUpdate,
  onStrokeEnd
}: CanvasProps) {
  const { backgroundType } = useBackgroundStore()
  const { activeTool, strokeColor, strokeSize } = useToolbarStore()

  // Elements store for shapes, notes, lasers
  const {
    shapes,
    notes,
    lasers,
    currentShape,
    startShape,
    updateShapeEnd,
    completeShape,
    createNote,
    updateNote,
    deleteNote,
    startLaser,
    addLaserPoint,
    selectElement,
    selectedElementIds,
    clearSelection,
  } = useElementsStore()

  // Canvas for pen/eraser strokes
  const {
    canvasRef,
    initCanvas,
    handlePointerDown: handleStrokePointerDown,
    handlePointerMove: handleStrokePointerMove,
    handlePointerUp: handleStrokePointerUp,
    handlePointerLeave,
    getCursorStyle,
  } = useCanvas({
    onStrokeStart,
    onStrokeUpdate,
    onStrokeEnd,
  })

  // Refs for tracking current element being created
  const currentShapeIdRef = useRef<string | null>(null)
  const currentLaserIdRef = useRef<string | null>(null)
  const shapesCanvasRef = useRef<HTMLCanvasElement>(null)
  const lasersCanvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize all canvases
  const initShapesCanvas = useCallback(() => {
    const canvas = shapesCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
  }, [])

  const initLasersCanvas = useCallback(() => {
    const canvas = lasersCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
  }, [])

  // Redraw shapes canvas
  useEffect(() => {
    const canvas = shapesCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear entire canvas (reset transform first)
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()

    // Draw all shapes
    for (const shape of shapes) {
      drawShape(ctx, shape)

      // Draw selection border if selected
      if (selectedElementIds.includes(shape.id)) {
        const bounds = {
          x: Math.min(shape.start.x, shape.end.x),
          y: Math.min(shape.start.y, shape.end.y),
          width: Math.abs(shape.end.x - shape.start.x),
          height: Math.abs(shape.end.y - shape.start.y),
        }

        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(
          bounds.x - 5,
          bounds.y - 5,
          bounds.width + 10,
          bounds.height + 10
        )
        ctx.setLineDash([])
      }
    }

    // Draw current shape being drawn
    if (currentShape) {
      drawShape(ctx, currentShape)
    }
  }, [shapes, currentShape, selectedElementIds, activeTool])

  // Redraw lasers canvas
  useEffect(() => {
    const canvas = lasersCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw laser trails
    for (const laser of lasers) {
      if (laser.points.length < 2) continue

      ctx.strokeStyle = laser.color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Fade effect based on age
      const age = Date.now() - laser.createdAt
      const opacity = Math.max(0, 1 - age / 2000)
      ctx.globalAlpha = opacity

      ctx.beginPath()
      ctx.moveTo(laser.points[0].x, laser.points[0].y)
      for (let i = 1; i < laser.points.length; i++) {
        ctx.lineTo(laser.points[i].x, laser.points[i].y)
      }
      ctx.stroke()
    }

    ctx.globalAlpha = 1
  }, [lasers])

  // Initialize all canvases on mount
  useEffect(() => {
    initCanvas()
    initShapesCanvas()
    initLasersCanvas()
  }, [initCanvas, initShapesCanvas, initLasersCanvas])

  // Handle pointer down for different tools
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const point = getPointFromEvent(event.nativeEvent, canvas)

      if (activeTool === 'pen' || activeTool === 'eraser') {
        // Pass to stroke handler
        handleStrokePointerDown(event as any)
      } else if (['rectangle', 'circle', 'arrow', 'line'].includes(activeTool)) {
        // Start shape
        const shape = startShape(
          activeTool as 'rectangle' | 'circle' | 'arrow' | 'line',
          point,
          strokeColor,
          strokeSize
        )
        currentShapeIdRef.current = shape.id
      } else if (activeTool === 'note') {
        // Create sticky note at click position
        createNote(point)
      } else if (activeTool === 'laser') {
        // Start laser trail
        const laser = startLaser(point, strokeColor)
        currentLaserIdRef.current = laser.id
      } else if (activeTool === 'select') {
        // Selection: Check if clicking on an element
        // Check notes first (they're on top)
        let foundElement = false

        for (const note of [...notes].reverse()) {
          if (
            point.x >= note.position.x &&
            point.x <= note.position.x + note.width &&
            point.y >= note.position.y &&
            point.y <= note.position.y + note.height
          ) {
            selectElement(note.id)
            foundElement = true
            break
          }
        }

        // Check shapes if no note found
        if (!foundElement) {
          for (const shape of [...shapes].reverse()) {
            const bounds = {
              x: Math.min(shape.start.x, shape.end.x),
              y: Math.min(shape.start.y, shape.end.y),
              width: Math.abs(shape.end.x - shape.start.x),
              height: Math.abs(shape.end.y - shape.start.y),
            }

            const padding = shape.strokeWidth / 2 + 5

            if (
              point.x >= bounds.x - padding &&
              point.x <= bounds.x + bounds.width + padding &&
              point.y >= bounds.y - padding &&
              point.y <= bounds.y + bounds.height + padding
            ) {
              selectElement(shape.id)
              foundElement = true
              break
            }
          }
        }

        // Clear selection if clicked on empty space
        if (!foundElement) {
          clearSelection()
        }
      }
    },
    [
      activeTool,
      strokeColor,
      strokeSize,
      startShape,
      createNote,
      startLaser,
      clearSelection,
      handleStrokePointerDown,
    ]
  )

  // Handle pointer move
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const point = getPointFromEvent(event.nativeEvent, canvas)

      if (activeTool === 'pen' || activeTool === 'eraser') {
        handleStrokePointerMove(event as any)
      } else if (
        ['rectangle', 'circle', 'arrow', 'line'].includes(activeTool) &&
        currentShapeIdRef.current
      ) {
        updateShapeEnd(point)
      } else if (activeTool === 'laser' && currentLaserIdRef.current) {
        addLaserPoint(currentLaserIdRef.current, point)
      }
    },
    [activeTool, updateShapeEnd, addLaserPoint, handleStrokePointerMove]
  )

  // Handle pointer up
  const handlePointerUp = useCallback(
    (_event: React.PointerEvent<HTMLDivElement>) => {
      if (activeTool === 'pen' || activeTool === 'eraser') {
        handleStrokePointerUp()
      } else if (
        ['rectangle', 'circle', 'arrow', 'line'].includes(activeTool) &&
        currentShapeIdRef.current
      ) {
        completeShape()
        currentShapeIdRef.current = null
      } else if (activeTool === 'laser' && currentLaserIdRef.current) {
        // Laser auto-fades, just clear ref
        currentLaserIdRef.current = null
      }
    },
    [activeTool, completeShape, handleStrokePointerUp]
  )

  return (
    <div className="relative w-full h-full">
      {/* Background pattern layer */}
      <BackgroundPattern type={backgroundType} zoom={1} />

      {/* Main canvas container */}
      <div
        className={cn('absolute inset-0 w-full h-full', className)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => handlePointerLeave()}
        style={{ cursor: getCursorStyle() }}
      >
        {/* Strokes canvas layer (pen/eraser) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none pointer-events-none"
        />

        {/* Shapes canvas layer */}
        <canvas
          ref={shapesCanvasRef}
          className="absolute inset-0 w-full h-full touch-none pointer-events-none"
        />

        {/* Laser pointer canvas layer */}
        <canvas
          ref={lasersCanvasRef}
          className="absolute inset-0 w-full h-full touch-none pointer-events-none"
        />

        {/* Sticky notes layer (HTML elements) */}
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            isSelected={selectedElementIds.includes(note.id)}
            onUpdate={updateNote}
            onDelete={deleteNote}
            onSelect={selectElement}
          />
        ))}
      </div>
    </div>
  )
}
