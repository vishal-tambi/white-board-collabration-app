import { useCallback, useRef, useEffect } from 'react'
import { useToolbarStore } from '@/stores/toolbarStore'
import { useCanvasStore } from '@/stores/canvasStore'
import { useElementsStore } from '@/stores/elementsStore'
import { useViewportStore } from '@/stores/viewportStore'
import { getPointFromEvent, redrawCanvas } from '@/utils/canvas'
import { drawShape } from '@/utils/shapes'
import type { Stroke, Point, ShapeElement } from '@/types'

/**
 * useEnhancedCanvas Hook
 *
 * Enhanced canvas hook that supports strokes, shapes, notes, laser pointers,
 * and viewport transformations (pan/zoom).
 */

interface UseEnhancedCanvasOptions {
    // Stroke events
    onStrokeStart?: (stroke: Stroke) => void
    onStrokeUpdate?: (strokeId: string, point: Point) => void
    onStrokeEnd?: (strokeId: string) => void

    // Shape events
    onShapeStart?: (shape: ShapeElement) => void
    onShapeUpdate?: (shapeId: string, endPoint: Point) => void
    onShapeEnd?: (shapeId: string) => void
}

export function useEnhancedCanvas(options: UseEnhancedCanvasOptions = {}) {
    const {
        onStrokeStart,
        onStrokeUpdate,
        onStrokeEnd,
        onShapeStart,
        onShapeUpdate,
        onShapeEnd,
    } = options

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)
    const currentStrokeIdRef = useRef<string | null>(null)
    const currentShapeIdRef = useRef<string | null>(null)

    // Stores
    const { activeTool, strokeColor, strokeSize } = useToolbarStore()
    const { viewport, screenToCanvas } = useViewportStore()

    // Canvas state (strokes)
    const {
        strokes,
        remoteStrokes,
        currentStroke,
        isDrawing,
        startStroke,
        addPoint,
        endStroke,
    } = useCanvasStore()

    // Elements state (shapes, notes, lasers)
    const {
        shapes,
        currentShape,
        startShape,
        updateShapeEnd,
        completeShape,
    } = useElementsStore()

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

        // Redraw everything
        redrawAll()
    }, [strokes, remoteStrokes, currentStroke, shapes, currentShape, viewport])

    // Redraw all elements
    const redrawAll = useCallback(() => {
        const ctx = contextRef.current
        if (!ctx) return

        // Clear canvas
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.restore()

        // Apply viewport transform
        ctx.save()
        ctx.translate(viewport.x, viewport.y)
        ctx.scale(viewport.zoom, viewport.zoom)

        // Draw strokes
        const allStrokes = [...strokes, ...Array.from(remoteStrokes.values())]
        redrawCanvas(ctx, allStrokes, currentStroke)

        // Draw shapes
        for (const shape of shapes) {
            drawShape(ctx, shape)
        }

        // Draw current shape being drawn
        if (currentShape) {
            drawShape(ctx, currentShape)
        }

        ctx.restore()
    }, [
        strokes,
        remoteStrokes,
        currentStroke,
        shapes,
        currentShape,
        viewport,
    ])

    // Handle pointer down (start drawing/shape)
    const handlePointerDown = useCallback(
        (event: React.PointerEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current
            if (!canvas) return

            // Get point in canvas coordinates (accounting for viewport)
            const screenPoint = getPointFromEvent(event.nativeEvent, canvas)
            const canvasPoint = screenToCanvas(screenPoint)

            // Capture pointer
            canvas.setPointerCapture(event.pointerId)

            // Handle based on active tool
            if (activeTool === 'pen') {
                const color = strokeColor
                const stroke = startStroke(canvasPoint, color, strokeSize, activeTool)
                if (stroke) {
                    currentStrokeIdRef.current = stroke.id
                    onStrokeStart?.(stroke)
                }
            } else if (activeTool === 'eraser') {
                const stroke = startStroke(
                    canvasPoint,
                    '#FFFFFF',
                    strokeSize,
                    activeTool
                )
                if (stroke) {
                    currentStrokeIdRef.current = stroke.id
                    onStrokeStart?.(stroke)
                }
            } else if (
                ['rectangle', 'circle', 'arrow', 'line'].includes(activeTool)
            ) {
                const shape = startShape(
                    activeTool as 'rectangle' | 'circle' | 'arrow' | 'line',
                    canvasPoint,
                    strokeColor,
                    strokeSize
                )
                currentShapeIdRef.current = shape.id
                onShapeStart?.(shape)
            }
        },
        [
            activeTool,
            strokeColor,
            strokeSize,
            startStroke,
            startShape,
            screenToCanvas,
            onStrokeStart,
            onShapeStart,
        ]
    )

    // Handle pointer move (add points while drawing)
    const handlePointerMove = useCallback(
        (event: React.PointerEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current
            if (!canvas) return

            const screenPoint = getPointFromEvent(event.nativeEvent, canvas)
            const canvasPoint = screenToCanvas(screenPoint)

            // Handle based on tool
            if ((activeTool === 'pen' || activeTool === 'eraser') && isDrawing) {
                addPoint(canvasPoint)
                if (currentStrokeIdRef.current) {
                    onStrokeUpdate?.(currentStrokeIdRef.current, canvasPoint)
                }
            } else if (
                ['rectangle', 'circle', 'arrow', 'line'].includes(activeTool) &&
                currentShape
            ) {
                updateShapeEnd(canvasPoint)
                if (currentShapeIdRef.current) {
                    onShapeUpdate?.(currentShapeIdRef.current, canvasPoint)
                }
            }
        },
        [
            activeTool,
            isDrawing,
            currentShape,
            addPoint,
            updateShapeEnd,
            screenToCanvas,
            onStrokeUpdate,
            onShapeUpdate,
        ]
    )

    // Handle pointer up (end drawing)
    const handlePointerUp = useCallback(
        (event: React.PointerEvent<HTMLCanvasElement>) => {
            const canvas = canvasRef.current
            if (!canvas) return

            canvas.releasePointerCapture(event.pointerId)

            // Handle based on tool
            if ((activeTool === 'pen' || activeTool === 'eraser') && isDrawing) {
                const completedStroke = endStroke()
                if (currentStrokeIdRef.current && completedStroke) {
                    onStrokeEnd?.(currentStrokeIdRef.current)
                }
                currentStrokeIdRef.current = null
            } else if (
                ['rectangle', 'circle', 'arrow', 'line'].includes(activeTool) &&
                currentShape
            ) {
                const completedShape = completeShape()
                if (currentShapeIdRef.current && completedShape) {
                    onShapeEnd?.(currentShapeIdRef.current)
                }
                currentShapeIdRef.current = null
            }
        },
        [
            activeTool,
            isDrawing,
            currentShape,
            endStroke,
            completeShape,
            onStrokeEnd,
            onShapeEnd,
        ]
    )

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

    // Redraw when anything changes
    useEffect(() => {
        redrawAll()
    }, [redrawAll])

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
            case 'pan':
                return 'grab'
            case 'rectangle':
            case 'circle':
            case 'arrow':
            case 'line':
                return 'crosshair'
            case 'note':
                return 'text'
            case 'laser':
                return 'pointer'
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
