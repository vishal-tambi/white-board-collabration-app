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
  // Remote strokes being drawn by other users (in-progress)
  remoteStrokes: Map<string, Stroke>
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
  ) => Stroke | null
  addPoint: (point: Point) => void
  endStroke: () => Stroke | null

  // Remote stroke actions (from other users)
  addRemoteStroke: (stroke: Stroke) => void
  updateRemoteStroke: (strokeId: string, point: Point) => void
  endRemoteStroke: (strokeId: string) => void

  // History actions
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // Canvas actions
  clear: () => void
  loadStrokes: (strokes: Stroke[]) => void

  // Get all strokes for rendering (completed + remote in-progress)
  getAllStrokes: () => Stroke[]
}

// Maximum history size to prevent memory issues
const MAX_HISTORY_SIZE = 50

export const useCanvasStore = create<CanvasState>((set, get) => ({
  strokes: [],
  remoteStrokes: new Map(),
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
    return stroke
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
      return null
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
      return currentStroke
    } else {
      set({ currentStroke: null, isDrawing: false })
      return null
    }
  },

  // Remote stroke handlers for real-time collaboration
  addRemoteStroke: (stroke) => {
    set((state) => {
      const newRemoteStrokes = new Map(state.remoteStrokes)
      newRemoteStrokes.set(stroke.id, stroke)
      return { remoteStrokes: newRemoteStrokes }
    })
  },

  updateRemoteStroke: (strokeId, point) => {
    set((state) => {
      const existingStroke = state.remoteStrokes.get(strokeId)
      if (!existingStroke) return state

      const newRemoteStrokes = new Map(state.remoteStrokes)
      newRemoteStrokes.set(strokeId, {
        ...existingStroke,
        points: [...existingStroke.points, point],
      })
      return { remoteStrokes: newRemoteStrokes }
    })
  },

  endRemoteStroke: (strokeId) => {
    set((state) => {
      const stroke = state.remoteStrokes.get(strokeId)
      if (!stroke) return state

      const newRemoteStrokes = new Map(state.remoteStrokes)
      newRemoteStrokes.delete(strokeId)

      return {
        strokes: [...state.strokes, stroke],
        remoteStrokes: newRemoteStrokes,
      }
    })
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
      remoteStrokes: new Map(),
      undoStack: [...undoStack, strokes].slice(-MAX_HISTORY_SIZE),
      redoStack: [],
      currentStroke: null,
      isDrawing: false,
    })
  },

  loadStrokes: (strokes) => {
    set({
      strokes,
      remoteStrokes: new Map(),
      undoStack: [],
      redoStack: [],
      currentStroke: null,
      isDrawing: false,
    })
  },

  getAllStrokes: () => {
    const { strokes, remoteStrokes } = get()
    return [...strokes, ...Array.from(remoteStrokes.values())]
  },
}))

