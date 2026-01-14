/**
 * Canvas Types
 *
 * Type definitions for the whiteboard canvas drawing system.
 * Supports multiple element types: strokes, shapes, sticky notes, and laser pointers.
 */

/** A single point on the canvas with optional pressure data */
export interface Point {
  x: number
  y: number
  /** Pressure from 0-1, used for variable stroke width */
  pressure?: number
}

/** A completed stroke on the canvas */
export interface Stroke {
  /** Unique identifier for the stroke */
  id: string
  /** Array of points that make up the stroke */
  points: Point[]
  /** Stroke color (CSS color string) */
  color: string
  /** Stroke width in pixels */
  size: number
  /** Tool used to create this stroke (only pen/eraser create strokes) */
  tool: 'pen' | 'eraser'
  /** Timestamp when stroke was created */
  timestamp: number
}

/** Options for creating a new stroke */
export interface StrokeOptions {
  color: string
  size: number
  tool: 'pen' | 'eraser'
}

/** Canvas dimensions */
export interface CanvasDimensions {
  width: number
  height: number
}

/** Drawing state for active stroke */
export interface DrawingState {
  isDrawing: boolean
  currentStroke: Stroke | null
}

/** Options for the perfect-freehand library */
export interface StrokeRenderOptions {
  size: number
  thinning: number
  smoothing: number
  streamline: number
  easing: (t: number) => number
  start: {
    taper: number
    cap: boolean
  }
  end: {
    taper: number
    cap: boolean
  }
}

/** Default stroke render options for smooth drawing */
export const DEFAULT_STROKE_OPTIONS: StrokeRenderOptions = {
  size: 8,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t) => t,
  start: {
    taper: 0,
    cap: true,
  },
  end: {
    taper: 0,
    cap: true,
  },
}

// ============================================================================
// NEW: Extended Canvas Element Types
// ============================================================================

/** Base interface for all canvas elements */
export interface BaseElement {
  id: string
  type: 'stroke' | 'shape' | 'note' | 'laser'
  timestamp: number
  userId?: string
}

/** Shape types for geometric drawing */
export type ShapeType = 'rectangle' | 'circle' | 'arrow' | 'line'

/** Geometric shape element */
export interface ShapeElement extends BaseElement {
  type: 'shape'
  shapeType: ShapeType
  start: Point
  end: Point
  color: string
  strokeWidth: number
  fillColor?: string
}

/** Sticky note element */
export interface NoteElement extends BaseElement {
  type: 'note'
  position: Point
  width: number
  height: number
  text: string
  color: string
  fontSize: number
}

/** Laser pointer trail (temporary, auto-fades) */
export interface LaserElement extends BaseElement {
  type: 'laser'
  points: Point[]
  color: string
  createdAt: number
}

/** Enhanced stroke element with type field for polymorphism */
export interface StrokeElement extends BaseElement {
  type: 'stroke'
  points: Point[]
  color: string
  size: number
  tool: 'pen' | 'eraser'
}

/** Unified canvas element type */
export type CanvasElement = StrokeElement | ShapeElement | NoteElement | LaserElement

/** Viewport state for pan and zoom */
export interface Viewport {
  x: number // Pan offset X
  y: number // Pan offset Y
  zoom: number // Zoom level (0.1 to 5.0)
}

/** Selection bounding box */
export interface SelectionBounds {
  x: number
  y: number
  width: number
  height: number
}

/** Grid background types */
export type BackgroundType = 'none' | 'dot' | 'grid' | 'lined'
