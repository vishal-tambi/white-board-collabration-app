import { useCallback, useRef, useEffect } from 'react'
import { useToolbarStore } from '@/stores/toolbarStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { getPointFromEvent, redrawCanvas } from '@/utils/canvas'
import type { Stroke, Point } from '@/types'

/**
 * useCanvas Hook
 *
 * Manages canvas drawing interactions and state synchronization.
 * Handles mouse, touch, and pointer events for drawing.
 */

interface UseCanvasOptions {
  onStrokeStart?: (stroke: Stroke) => void
  onStrokeUpdate?: (strokeId: string, point: Point) => void
  onStrokeEnd?: (strokeId: string) => void
}

export function useCanvas(options: UseCanvasOptions = {}) {
  const { onStrokeStart, onStrokeUpdate, onStrokeEnd } = options
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const currentStrokeIdRef = useRef<string | null>(null)

  // Toolbar state
  const { activeTool, strokeColor, strokeSize } = useToolbarStore()

  // Canvas state
  const {
    strokes,
    remoteStrokes,
    currentStroke,
    isDrawing,
    startStroke,
    addPoint,
    endStroke,
  } = useCanvasStore()

  // Initialize canvas context
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size to match container
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Scale for high-DPI displays
    ctx.scale(dpr, dpr)

    // Set rendering options
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    contextRef.current = ctx

    // Get all strokes including remote ones for rendering
    const allStrokes = [...strokes, ...Array.from(remoteStrokes.values())]

    // Redraw existing strokes
    redrawCanvas(ctx, allStrokes, currentStroke)
  }, [strokes, remoteStrokes, currentStroke])

  // Handle pointer down (start drawing)
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      // Only handle pen and eraser tools (shapes/notes/etc handled elsewhere)
      if (activeTool !== 'pen' && activeTool !== 'eraser') return

      const canvas = canvasRef.current
      if (!canvas) return

      // Capture pointer for better tracking
      canvas.setPointerCapture(event.pointerId)

      const point = getPointFromEvent(event.nativeEvent, canvas)

      // Use background color for eraser visual feedback
      const color = activeTool === 'eraser' ? '#FFFFFF' : strokeColor

      const stroke = startStroke(point, color, strokeSize, activeTool)

      if (stroke) {
        currentStrokeIdRef.current = stroke.id
        // Emit socket event for stroke start
        onStrokeStart?.(stroke)
      }
    },
    [activeTool, strokeColor, strokeSize, startStroke, onStrokeStart]
  )

  // Handle pointer move (add points while drawing)
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const point = getPointFromEvent(event.nativeEvent, canvas)
      addPoint(point)

      // Emit socket event for stroke update
      if (currentStrokeIdRef.current) {
        onStrokeUpdate?.(currentStrokeIdRef.current, point)
      }
    },
    [isDrawing, addPoint, onStrokeUpdate]
  )

  // Handle pointer up (end drawing)
  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return

    const completedStroke = endStroke()

    // Emit socket event for stroke end
    if (currentStrokeIdRef.current && completedStroke) {
      onStrokeEnd?.(currentStrokeIdRef.current)
    }
    currentStrokeIdRef.current = null
  }, [isDrawing, endStroke, onStrokeEnd])

  // Handle pointer leave
  const handlePointerLeave = useCallback(() => {
    if (isDrawing) {
      const completedStroke = endStroke()

      if (currentStrokeIdRef.current && completedStroke) {
        onStrokeEnd?.(currentStrokeIdRef.current)
      }
      currentStrokeIdRef.current = null
    }
  }, [isDrawing, endStroke, onStrokeEnd])

  // Redraw canvas when strokes change
  useEffect(() => {
    const ctx = contextRef.current
    if (!ctx) return

    // Include remote strokes in rendering
    const allStrokes = [...strokes, ...Array.from(remoteStrokes.values())]
    redrawCanvas(ctx, allStrokes, currentStroke)
  }, [strokes, remoteStrokes, currentStroke])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      initCanvas()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [initCanvas])

  // Get cursor style based on active tool
  const getCursorStyle = useCallback(() => {
    switch (activeTool) {
      case 'pen':
        return 'crosshair'
      case 'eraser':
        return 'cell'
      case 'select':
        return 'default'
      default:
        return 'crosshair'
    }
  }, [activeTool])

  return {
    canvasRef,
    initCanvas,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerLeave,
    getCursorStyle,
  }
}

