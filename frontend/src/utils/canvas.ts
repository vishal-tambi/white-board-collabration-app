import getStroke from 'perfect-freehand'
import type { Point, Stroke, StrokeRenderOptions } from '@/types'
import { DEFAULT_STROKE_OPTIONS } from '@/types'

/**
 * Canvas Utility Functions
 *
 * Helper functions for canvas rendering and stroke processing.
 */

/**
 * Get stroke outline points using perfect-freehand
 * Returns an array of points that form the outline of the stroke
 */
export function getStrokeOutlinePoints(
  points: Point[],
  options: Partial<StrokeRenderOptions> = {}
): number[][] {
  const mergedOptions = { ...DEFAULT_STROKE_OPTIONS, ...options }

  // Convert Point[] to number[][] for perfect-freehand
  const inputPoints = points.map((p) => [p.x, p.y, p.pressure ?? 0.5])

  return getStroke(inputPoints, mergedOptions)
}

/**
 * Convert stroke outline points to SVG path data
 */
export function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return ''

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')
  return d.join(' ')
}

/**
 * Draw a stroke to a canvas context
 */
export function drawStrokeToCanvas(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  isEraser: boolean = false
): void {
  if (stroke.points.length < 2) return

  const outlinePoints = getStrokeOutlinePoints(stroke.points, {
    size: stroke.size,
  })

  const pathData = getSvgPathFromStroke(outlinePoints)
  const path = new Path2D(pathData)

  if (isEraser || stroke.tool === 'eraser') {
    // For eraser, use destination-out to remove pixels
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0,0,0,1)'
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = stroke.color
  }

  ctx.fill(path)

  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over'
}

/**
 * Clear the entire canvas
 */
export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

/**
 * Redraw all strokes to canvas
 */
export function redrawCanvas(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  currentStroke: Stroke | null = null
): void {
  clearCanvas(ctx)

  // Draw all completed strokes
  for (const stroke of strokes) {
    drawStrokeToCanvas(ctx, stroke)
  }

  // Draw current stroke if exists
  if (currentStroke && currentStroke.points.length > 1) {
    drawStrokeToCanvas(ctx, currentStroke)
  }
}

/**
 * Get point from mouse/touch event relative to canvas
 */
export function getPointFromEvent(
  event: MouseEvent | TouchEvent | PointerEvent,
  canvas: HTMLCanvasElement
): Point {
  const rect = canvas.getBoundingClientRect()

  let clientX: number
  let clientY: number
  let pressure = 0.5

  if ('touches' in event) {
    // Touch event
    const touch = event.touches[0] || event.changedTouches[0]
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    // Mouse or Pointer event
    clientX = event.clientX
    clientY = event.clientY

    // Get pressure from pointer event if available
    if ('pressure' in event && event.pressure > 0) {
      pressure = event.pressure
    }
  }

  // Scale for high-DPI displays
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
    pressure,
  }
}

/**
 * Export canvas to data URL
 */
export function canvasToDataURL(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' = 'png',
  quality = 0.92
): string {
  return canvas.toDataURL(`image/${format}`, quality)
}

/**
 * Download canvas as image
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename = 'whiteboard',
  format: 'png' | 'jpeg' = 'png'
): void {
  const dataURL = canvasToDataURL(canvas, format)
  const link = document.createElement('a')
  link.download = `${filename}.${format}`
  link.href = dataURL
  link.click()
}
