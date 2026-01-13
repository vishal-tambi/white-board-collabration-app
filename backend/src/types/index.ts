/**
 * Shared TypeScript types for the whiteboard backend.
 * These mirror the frontend types for consistency.
 */

// ============ Canvas Types ============

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

// ============ Room Types ============

/** User in a room */
export interface RoomUser {
    id: string
    name: string
    color: string
    cursor?: {
        x: number
        y: number
    }
}

/** Room state */
export interface RoomState {
    id: string
    users: RoomUser[]
    createdAt: number
}

// ============ Socket Event Types ============

/** Events emitted by the client to the server */
export interface ClientToServerEvents {
    // Room management
    'room:join': (data: { roomId: string; user: RoomUser }) => void
    'room:leave': (data: { roomId: string }) => void

    // Drawing events
    'stroke:start': (data: { roomId: string; stroke: Stroke }) => void
    'stroke:update': (data: {
        roomId: string
        strokeId: string
        point: Point
    }) => void
    'stroke:end': (data: { roomId: string; strokeId: string }) => void
    'stroke:delete': (data: { roomId: string; strokeId: string }) => void

    // Canvas events
    'canvas:clear': (data: { roomId: string }) => void
    'canvas:undo': (data: { roomId: string }) => void
    'canvas:redo': (data: { roomId: string }) => void

    // Cursor events
    'cursor:move': (data: {
        roomId: string
        cursor: { x: number; y: number }
    }) => void
}

/** Events emitted by the server to the client */
export interface ServerToClientEvents {
    // Room events
    'room:joined': (data: { users: RoomUser[] }) => void
    'room:user-joined': (data: { user: RoomUser }) => void
    'room:user-left': (data: { userId: string }) => void

    // Drawing events (from other users)
    'stroke:started': (data: { userId: string; stroke: Stroke }) => void
    'stroke:updated': (data: {
        userId: string
        strokeId: string
        point: Point
    }) => void
    'stroke:ended': (data: { userId: string; strokeId: string }) => void
    'stroke:deleted': (data: { userId: string; strokeId: string }) => void

    // Canvas events (from other users)
    'canvas:cleared': (data: { userId: string }) => void
    'canvas:strokes': (data: { strokes: Stroke[] }) => void

    // Cursor events (from other users)
    'cursor:moved': (data: {
        userId: string
        cursor: { x: number; y: number }
    }) => void

    // Error events
    error: (data: { message: string }) => void
}

/** Socket data stored per connection */
export interface SocketData {
    userId: string
    userName: string
    userColor: string
    roomId: string | null
}
