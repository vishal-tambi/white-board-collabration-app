/**
 * Room Types
 *
 * Type definitions for room and collaboration features.
 * Used in Phase 4 for real-time collaboration.
 */

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

/** Connection status for real-time features */
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected'
