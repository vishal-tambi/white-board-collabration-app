/**
 * Canvas Types
 *
 * Type definitions for the whiteboard canvas drawing system.
 */

/** A single point on the canvas with optional pressure data */
export interface Point {
  x: number
  y: number
  /** Pressure from 0-1, used for variable stroke width */
  pressure?: number
}

/** Drawing tool types available in the toolbar */
export type ToolType = 'pen' | 'eraser' | 'select'

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
  /** Tool used to create this stroke */
  tool: ToolType
  /** Timestamp when stroke was created */
  timestamp: number
}

/** Options for creating a new stroke */
export interface StrokeOptions {
  color: string
  size: number
  tool: ToolType
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
