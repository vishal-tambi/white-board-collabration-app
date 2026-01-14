import { create } from 'zustand'
import type { Viewport, Point } from '@/types'

/**
 * Viewport Store
 *
 * Manages pan and zoom state for the infinite canvas.
 * Handles coordinate transformations between screen and canvas space.
 */

interface ViewportState {
    viewport: Viewport

    // Actions
    setZoom: (zoom: number) => void
    setPan: (x: number, y: number) => void
    panBy: (dx: number, dy: number) => void
    resetViewport: () => void

    // Coordinate transformations
    screenToCanvas: (point: Point) => Point
    canvasToScreen: (point: Point) => Point
}

const DEFAULT_VIEWPORT: Viewport = {
    x: 0,
    y: 0,
    zoom: 1,
}

const MIN_ZOOM = 0.1
const MAX_ZOOM = 5.0

export const useViewportStore = create<ViewportState>((set, get) => ({
    viewport: DEFAULT_VIEWPORT,

    setZoom: (zoom) => {
        const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom))
        set((state) => ({
            viewport: { ...state.viewport, zoom: clampedZoom },
        }))
    },

    setPan: (x, y) => {
        set((state) => ({
            viewport: { ...state.viewport, x, y },
        }))
    },

    panBy: (dx, dy) => {
        set((state) => ({
            viewport: {
                ...state.viewport,
                x: state.viewport.x + dx,
                y: state.viewport.y + dy,
            },
        }))
    },

    resetViewport: () => {
        set({ viewport: DEFAULT_VIEWPORT })
    },

    // Transform screen coordinates to canvas coordinates
    screenToCanvas: (point) => {
        const { viewport } = get()
        return {
            x: (point.x - viewport.x) / viewport.zoom,
            y: (point.y - viewport.y) / viewport.zoom,
        }
    },

    // Transform canvas coordinates to screen coordinates
    canvasToScreen: (point) => {
        const { viewport } = get()
        return {
            x: point.x * viewport.zoom + viewport.x,
            y: point.y * viewport.zoom + viewport.y,
        }
    },
}))
