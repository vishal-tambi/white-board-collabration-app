import { useCallback, useRef, useEffect } from 'react'
import { useToolbarStore } from '@/stores/toolbarStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { getPointFromEvent, redrawCanvas } from '@/utils/canvas'

/**
 * useCanvas Hook
 *
 * Manages canvas drawing interactions and state synchronization.
 * Handles mouse, touch, and pointer events for drawing.
 */
export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)

  // Toolbar state
  const { activeTool, strokeColor, strokeSize } = useToolbarStore()

  // Canvas state
  const {
    strokes,
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

    // Redraw existing strokes
    redrawCanvas(ctx, strokes, currentStroke)
  }, [strokes, currentStroke])

  // Handle pointer down (start drawing)
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (activeTool === 'select') return

      const canvas = canvasRef.current
      if (!canvas) return

      // Capture pointer for better tracking
      canvas.setPointerCapture(event.pointerId)

      const point = getPointFromEvent(event.nativeEvent, canvas)

      // Use background color for eraser visual feedback
      const color = activeTool === 'eraser' ? '#FFFFFF' : strokeColor

      startStroke(point, color, strokeSize, activeTool)
    },
    [activeTool, strokeColor, strokeSize, startStroke]
  )

  // Handle pointer move (add points while drawing)
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const point = getPointFromEvent(event.nativeEvent, canvas)
      addPoint(point)
    },
    [isDrawing, addPoint]
  )

  // Handle pointer up (end drawing)
  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return
    endStroke()
  }, [isDrawing, endStroke])

  // Handle pointer leave
  const handlePointerLeave = useCallback(() => {
    if (isDrawing) {
      endStroke()
    }
  }, [isDrawing, endStroke])

  // Redraw canvas when strokes change
  useEffect(() => {
    const ctx = contextRef.current
    if (!ctx) return

    redrawCanvas(ctx, strokes, currentStroke)
  }, [strokes, currentStroke])

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
