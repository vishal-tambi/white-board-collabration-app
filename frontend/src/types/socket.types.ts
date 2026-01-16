/**
 * Socket Event Types
 *
 * Type definitions for Socket.IO events between client and server.
 * These types ensure type-safety in real-time communication.
 */

import type { Stroke, Point, ShapeElement } from './canvas.types'
import type { RoomUser } from './room.types'

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

  // Shape events
  'shape:start': (data: { roomId: string; shape: ShapeElement }) => void
  'shape:update': (data: { roomId: string; shapeId: string; endPoint: Point }) => void
  'shape:end': (data: { roomId: string; shapeId: string }) => void

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

  // Shape events (from other users)
  'shape:started': (data: { userId: string; shape: ShapeElement }) => void
  'shape:updated': (data: { userId: string; shapeId: string; endPoint: Point }) => void
  'shape:ended': (data: { userId: string; shapeId: string }) => void

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

/** Socket connection status */
export type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'
