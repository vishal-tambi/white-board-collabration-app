import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type { Stroke, Point, ToolType } from '@/types'

/**
 * Canvas Store
 *
 * Manages strokes, undo/redo history, and canvas operations.
 * Optimized for frequent updates during drawing.
 */

interface CanvasState {
  // All completed strokes on the canvas
  strokes: Stroke[]
  // Undo stack (previous states)
  undoStack: Stroke[][]
  // Redo stack (future states)
  redoStack: Stroke[][]
  // Currently active stroke being drawn
  currentStroke: Stroke | null
  // Whether user is currently drawing
  isDrawing: boolean

  // Drawing actions
  startStroke: (
    point: Point,
    color: string,
    size: number,
    tool: ToolType
  ) => void
  addPoint: (point: Point) => void
  endStroke: () => void

  // History actions
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // Canvas actions
  clear: () => void
  loadStrokes: (strokes: Stroke[]) => void
}

// Maximum history size to prevent memory issues
const MAX_HISTORY_SIZE = 50

export const useCanvasStore = create<CanvasState>((set, get) => ({
  strokes: [],
  undoStack: [],
  redoStack: [],
  currentStroke: null,
  isDrawing: false,

  startStroke: (point, color, size, tool) => {
    const stroke: Stroke = {
      id: nanoid(),
      points: [point],
      color,
      size,
      tool,
      timestamp: Date.now(),
    }
    set({ currentStroke: stroke, isDrawing: true })
  },

  addPoint: (point) => {
    const { currentStroke } = get()
    if (!currentStroke) return

    set({
      currentStroke: {
        ...currentStroke,
        points: [...currentStroke.points, point],
      },
    })
  },

  endStroke: () => {
    const { currentStroke, strokes, undoStack } = get()
    if (!currentStroke) {
      set({ isDrawing: false })
      return
    }

    // Only save strokes with more than 1 point (avoid clicks)
    if (currentStroke.points.length > 1) {
      // Save current state for undo
      const newUndoStack = [...undoStack, strokes].slice(-MAX_HISTORY_SIZE)

      set({
        strokes: [...strokes, currentStroke],
        undoStack: newUndoStack,
        redoStack: [], // Clear redo stack on new action
        currentStroke: null,
        isDrawing: false,
      })
    } else {
      set({ currentStroke: null, isDrawing: false })
    }
  },

  undo: () => {
    const { strokes, undoStack, redoStack } = get()
    if (undoStack.length === 0) return

    const previousState = undoStack[undoStack.length - 1]
    const newUndoStack = undoStack.slice(0, -1)
    const newRedoStack = [...redoStack, strokes].slice(-MAX_HISTORY_SIZE)

    set({
      strokes: previousState,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    })
  },

  redo: () => {
    const { strokes, undoStack, redoStack } = get()
    if (redoStack.length === 0) return

    const nextState = redoStack[redoStack.length - 1]
    const newRedoStack = redoStack.slice(0, -1)
    const newUndoStack = [...undoStack, strokes].slice(-MAX_HISTORY_SIZE)

    set({
      strokes: nextState,
      undoStack: newUndoStack,
      redoStack: newRedoStack,
    })
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  clear: () => {
    const { strokes, undoStack } = get()
    if (strokes.length === 0) return

    set({
      strokes: [],
      undoStack: [...undoStack, strokes].slice(-MAX_HISTORY_SIZE),
      redoStack: [],
      currentStroke: null,
      isDrawing: false,
    })
  },

  loadStrokes: (strokes) => {
    set({
      strokes,
      undoStack: [],
      redoStack: [],
      currentStroke: null,
      isDrawing: false,
    })
  },
}))
