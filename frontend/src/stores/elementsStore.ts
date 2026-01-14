import { create } from 'zustand'
import { nanoid } from 'nanoid'
import type {
    ShapeElement,
    NoteElement,
    LaserElement,
    Point,
    ShapeType,
    CanvasElement,
} from '@/types'

/**
 * Elements Store
 *
 * Manages non-stroke canvas elements: shapes, notes, and laser pointers.
 * Complements the canvasStore which handles strokes separately.
 */

interface ElementsState {
    // All shapes on the canvas
    shapes: ShapeElement[]
    // All sticky notes
    notes: NoteElement[]
    // Active laser pointers (temporary, auto-fade after 2s)
    lasers: LaserElement[]

    // Current element being created
    currentShape: ShapeElement | null
    currentNote: NoteElement | null

    // Remote elements from other users
    remoteShapes: Map<string, ShapeElement>
    remoteNotes: Map<string, NoteElement>
    remoteLasers: Map<string, LaserElement>

    // Selection
    selectedElementIds: string[]

    // Shape actions
    startShape: (
        type: ShapeType,
        point: Point,
        color: string,
        strokeWidth: number
    ) => ShapeElement
    updateShapeEnd: (point: Point) => void
    completeShape: () => ShapeElement | null

    // Note actions
    createNote: (position: Point, color?: string) => NoteElement
    updateNote: (id: string, updates: Partial<NoteElement>) => void
    deleteNote: (id: string) => void

    // Laser pointer actions
    startLaser: (point: Point, color: string) => LaserElement
    addLaserPoint: (id: string, point: Point) => void
    endLaser: (id: string) => void

    // Remote element actions
    addRemoteShape: (shape: ShapeElement) => void
    updateRemoteShape: (id: string, updates: Partial<ShapeElement>) => void
    completeRemoteShape: (id: string) => void
    addRemoteNote: (note: NoteElement) => void
    updateRemoteNote: (id: string, updates: Partial<NoteElement>) => void
    addRemoteLaser: (laser: LaserElement) => void
    updateRemoteLaser: (id: string, point: Point) => void
    endRemoteLaser: (id: string) => void

    // Selection actions
    selectElement: (id: string) => void
    selectMultiple: (ids: string[]) => void
    clearSelection: () => void
    deleteSelected: () => void

    // Utility
    getElementByPoint: (point: Point) => CanvasElement | null
    clear: () => void
    getAllElements: () => CanvasElement[]
}

export const useElementsStore = create<ElementsState>((set, get) => ({
    shapes: [],
    notes: [],
    lasers: [],
    currentShape: null,
    currentNote: null,
    remoteShapes: new Map(),
    remoteNotes: new Map(),
    remoteLasers: new Map(),
    selectedElementIds: [],

    // Shape creation
    startShape: (type, point, color, strokeWidth) => {
        const shape: ShapeElement = {
            id: nanoid(),
            type: 'shape',
            shapeType: type,
            start: point,
            end: point,
            color,
            strokeWidth,
            timestamp: Date.now(),
        }
        set({ currentShape: shape })
        return shape
    },

    updateShapeEnd: (point) => {
        const { currentShape } = get()
        if (!currentShape) return

        set({
            currentShape: { ...currentShape, end: point },
        })
    },

    completeShape: () => {
        const { currentShape, shapes } = get()
        if (!currentShape) return null

        // Only save if shape has meaningful size
        const width = Math.abs(currentShape.end.x - currentShape.start.x)
        const height = Math.abs(currentShape.end.y - currentShape.start.y)

        if (width > 2 || height > 2) {
            set({
                shapes: [...shapes, currentShape],
                currentShape: null,
            })
            return currentShape
        }

        set({ currentShape: null })
        return null
    },

    // Note actions
    createNote: (position, color = '#fef3c7') => {
        const note: NoteElement = {
            id: nanoid(),
            type: 'note',
            position,
            width: 200,
            height: 150,
            text: '',
            color,
            fontSize: 14,
            timestamp: Date.now(),
        }
        set((state) => ({ notes: [...state.notes, note] }))
        return note
    },

    updateNote: (id, updates) => {
        set((state) => ({
            notes: state.notes.map((note) =>
                note.id === id ? { ...note, ...updates } : note
            ),
        }))
    },

    deleteNote: (id) => {
        set((state) => ({
            notes: state.notes.filter((note) => note.id !== id),
            selectedElementIds: state.selectedElementIds.filter((eid) => eid !== id),
        }))
    },

    // Laser pointer actions
    startLaser: (point, color) => {
        const laser: LaserElement = {
            id: nanoid(),
            type: 'laser',
            points: [point],
            color,
            createdAt: Date.now(),
            timestamp: Date.now(),
        }
        set((state) => ({ lasers: [...state.lasers, laser] }))

        // Auto-remove after 2 seconds
        setTimeout(() => {
            set((state) => ({
                lasers: state.lasers.filter((l) => l.id !== laser.id),
            }))
        }, 2000)

        return laser
    },

    addLaserPoint: (id, point) => {
        set((state) => ({
            lasers: state.lasers.map((laser) =>
                laser.id === id
                    ? { ...laser, points: [...laser.points, point] }
                    : laser
            ),
        }))
    },

    endLaser: (_id) => {
        // Laser already has auto-fade, nothing to do
    },

    // Remote element handlers
    addRemoteShape: (shape) => {
        set((state) => {
            const newRemoteShapes = new Map(state.remoteShapes)
            newRemoteShapes.set(shape.id, shape)
            return { remoteShapes: newRemoteShapes }
        })
    },

    updateRemoteShape: (id, updates) => {
        set((state) => {
            const shape = state.remoteShapes.get(id)
            if (!shape) return state

            const newRemoteShapes = new Map(state.remoteShapes)
            newRemoteShapes.set(id, { ...shape, ...updates })
            return { remoteShapes: newRemoteShapes }
        })
    },

    completeRemoteShape: (id) => {
        set((state) => {
            const shape = state.remoteShapes.get(id)
            if (!shape) return state

            const newRemoteShapes = new Map(state.remoteShapes)
            newRemoteShapes.delete(id)

            return {
                shapes: [...state.shapes, shape],
                remoteShapes: newRemoteShapes,
            }
        })
    },

    addRemoteNote: (note) => {
        set((state) => {
            const newRemoteNotes = new Map(state.remoteNotes)
            newRemoteNotes.set(note.id, note)
            return { remoteNotes: newRemoteNotes }
        })
    },

    updateRemoteNote: (id, updates) => {
        set((state) => {
            const note = state.remoteNotes.get(id)
            if (!note) return state

            const newRemoteNotes = new Map(state.remoteNotes)
            newRemoteNotes.set(id, { ...note, ...updates })
            return { remoteNotes: newRemoteNotes }
        })
    },

    addRemoteLaser: (laser) => {
        set((state) => {
            const newRemoteLasers = new Map(state.remoteLasers)
            newRemoteLasers.set(laser.id, laser)
            return { remoteLasers: newRemoteLasers }
        })

        // Auto-remove after 2 seconds
        setTimeout(() => {
            set((state) => {
                const newRemoteLasers = new Map(state.remoteLasers)
                newRemoteLasers.delete(laser.id)
                return { remoteLasers: newRemoteLasers }
            })
        }, 2000)
    },

    updateRemoteLaser: (id, point) => {
        set((state) => {
            const laser = state.remoteLasers.get(id)
            if (!laser) return state

            const newRemoteLasers = new Map(state.remoteLasers)
            newRemoteLasers.set(id, {
                ...laser,
                points: [...laser.points, point],
            })
            return { remoteLasers: newRemoteLasers }
        })
    },

    endRemoteLaser: (_id) => {
        // Auto-fade handles removal
    },

    // Selection
    selectElement: (id) => {
        set({ selectedElementIds: [id] })
    },

    selectMultiple: (ids) => {
        set({ selectedElementIds: ids })
    },

    clearSelection: () => {
        set({ selectedElementIds: [] })
    },

    deleteSelected: () => {
        const { selectedElementIds } = get()
        set((state) => ({
            shapes: state.shapes.filter((s) => !selectedElementIds.includes(s.id)),
            notes: state.notes.filter((n) => !selectedElementIds.includes(n.id)),
            selectedElementIds: [],
        }))
    },

    // Utilities
    getElementByPoint: (point) => {
        const { shapes, notes } = get()

        // Check notes first (they're on top)
        for (const note of [...notes].reverse()) {
            if (
                point.x >= note.position.x &&
                point.x <= note.position.x + note.width &&
                point.y >= note.position.y &&
                point.y <= note.position.y + note.height
            ) {
                return note
            }
        }

        // Check shapes
        for (const shape of [...shapes].reverse()) {
            const bounds = {
                x: Math.min(shape.start.x, shape.end.x),
                y: Math.min(shape.start.y, shape.end.y),
                width: Math.abs(shape.end.x - shape.start.x),
                height: Math.abs(shape.end.y - shape.start.y),
            }

            const padding = shape.strokeWidth / 2 + 5

            if (
                point.x >= bounds.x - padding &&
                point.x <= bounds.x + bounds.width + padding &&
                point.y >= bounds.y - padding &&
                point.y <= bounds.y + bounds.height + padding
            ) {
                return shape
            }
        }

        return null
    },

    clear: () => {
        set({
            shapes: [],
            notes: [],
            lasers: [],
            currentShape: null,
            currentNote: null,
            selectedElementIds: [],
        })
    },

    getAllElements: () => {
        const { shapes, notes, lasers, remoteShapes, remoteNotes, remoteLasers } =
            get()

        return [
            ...shapes,
            ...notes,
            ...lasers,
            ...Array.from(remoteShapes.values()),
            ...Array.from(remoteNotes.values()),
            ...Array.from(remoteLasers.values()),
        ]
    },
}))
