import type {
    Point,
    ShapeElement,
    NoteElement,
    CanvasElement,
    SelectionBounds,
} from '@/types'

/**
 * Shape Utilities
 *
 * Helper functions for rendering and manipulating geometric shapes.
 */

/**
 * Draw a rectangle shape to canvas
 */
export function drawRectangle(
    ctx: CanvasRenderingContext2D,
    shape: ShapeElement
): void {
    const { start, end, color, strokeWidth, fillColor } = shape

    const x = Math.min(start.x, end.x)
    const y = Math.min(start.y, end.y)
    const width = Math.abs(end.x - start.x)
    const height = Math.abs(end.y - start.y)

    ctx.strokeStyle = color
    ctx.lineWidth = strokeWidth

    if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fillRect(x, y, width, height)
    }

    ctx.strokeRect(x, y, width, height)
}

/**
 * Draw a circle shape to canvas
 */
export function drawCircle(
    ctx: CanvasRenderingContext2D,
    shape: ShapeElement
): void {
    const { start, end, color, strokeWidth, fillColor } = shape

    const centerX = (start.x + end.x) / 2
    const centerY = (start.y + end.y) / 2
    const radiusX = Math.abs(end.x - start.x) / 2
    const radiusY = Math.abs(end.y - start.y) / 2

    ctx.beginPath()
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)

    if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fill()
    }

    ctx.strokeStyle = color
    ctx.lineWidth = strokeWidth
    ctx.stroke()
}

/**
 * Draw a line shape to canvas
 */
export function drawLine(
    ctx: CanvasRenderingContext2D,
    shape: ShapeElement
): void {
    const { start, end, color, strokeWidth } = shape

    ctx.strokeStyle = color
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
}

/**
 * Draw an arrow shape to canvas
 */
export function drawArrow(
    ctx: CanvasRenderingContext2D,
    shape: ShapeElement
): void {
    const { start, end, color, strokeWidth } = shape

    // Draw main line
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'

    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()

    // Calculate arrowhead
    const angle = Math.atan2(end.y - start.y, end.x - start.x)
    const headLength = Math.max(strokeWidth * 3, 15)

    const arrowPoint1 = {
        x: end.x - headLength * Math.cos(angle - Math.PI / 6),
        y: end.y - headLength * Math.sin(angle - Math.PI / 6),
    }

    const arrowPoint2 = {
        x: end.x - headLength * Math.cos(angle + Math.PI / 6),
        y: end.y - headLength * Math.sin(angle + Math.PI / 6),
    }

    // Draw arrowhead
    ctx.beginPath()
    ctx.moveTo(end.x, end.y)
    ctx.lineTo(arrowPoint1.x, arrowPoint1.y)
    ctx.lineTo(arrowPoint2.x, arrowPoint2.y)
    ctx.closePath()
    ctx.fill()
}

/**
 * Draw any shape to canvas
 */
export function drawShape(
    ctx: CanvasRenderingContext2D,
    shape: ShapeElement
): void {
    switch (shape.shapeType) {
        case 'rectangle':
            drawRectangle(ctx, shape)
            break
        case 'circle':
            drawCircle(ctx, shape)
            break
        case 'line':
            drawLine(ctx, shape)
            break
        case 'arrow':
            drawArrow(ctx, shape)
            break
    }
}

/**
 * Get bounding box for a shape
 */
export function getShapeBounds(shape: ShapeElement): SelectionBounds {
    const x = Math.min(shape.start.x, shape.end.x)
    const y = Math.min(shape.start.y, shape.end.y)
    const width = Math.abs(shape.end.x - shape.start.x)
    const height = Math.abs(shape.end.y - shape.start.y)

    return { x, y, width, height }
}

/**
 * Check if a point is inside a shape
 */
export function isPointInShape(point: Point, shape: ShapeElement): boolean {
    const bounds = getShapeBounds(shape)
    const padding = shape.strokeWidth / 2 + 5 // Extra padding for easier selection

    return (
        point.x >= bounds.x - padding &&
        point.x <= bounds.x + bounds.width + padding &&
        point.y >= bounds.y - padding &&
        point.y <= bounds.y + bounds.height + padding
    )
}

/**
 * Check if a point is inside a note
 */
export function isPointInNote(point: Point, note: NoteElement): boolean {
    return (
        point.x >= note.position.x &&
        point.x <= note.position.x + note.width &&
        point.y >= note.position.y &&
        point.y <= note.position.y + note.height
    )
}

/**
 * Get bounding box for any canvas element
 */
export function getElementBounds(element: CanvasElement): SelectionBounds {
    switch (element.type) {
        case 'shape':
            return getShapeBounds(element)

        case 'note':
            return {
                x: element.position.x,
                y: element.position.y,
                width: element.width,
                height: element.height,
            }

        case 'stroke': {
            if (element.points.length === 0) {
                return { x: 0, y: 0, width: 0, height: 0 }
            }

            let minX = element.points[0].x
            let minY = element.points[0].y
            let maxX = element.points[0].x
            let maxY = element.points[0].y

            for (const point of element.points) {
                minX = Math.min(minX, point.x)
                minY = Math.min(minY, point.y)
                maxX = Math.max(maxX, point.x)
                maxY = Math.max(maxY, point.y)
            }

            const padding = element.size / 2 + 5

            return {
                x: minX - padding,
                y: minY - padding,
                width: maxX - minX + padding * 2,
                height: maxY - minY + padding * 2,
            }
        }

        case 'laser':
            return { x: 0, y: 0, width: 0, height: 0 } // Laser trails aren't selectable

        default:
            return { x: 0, y: 0, width: 0, height: 0 }
    }
}

/**
 * Check if a point is inside any canvas element
 */
export function isPointInElement(
    point: Point,
    element: CanvasElement
): boolean {
    switch (element.type) {
        case 'shape':
            return isPointInShape(point, element)

        case 'note':
            return isPointInNote(point, element)

        case 'stroke': {
            const bounds = getElementBounds(element)
            return (
                point.x >= bounds.x &&
                point.x <= bounds.x + bounds.width &&
                point.y >= bounds.y &&
                point.y <= bounds.y + bounds.height
            )
        }

        case 'laser':
            return false // Laser trails aren't selectable

        default:
            return false
    }
}
