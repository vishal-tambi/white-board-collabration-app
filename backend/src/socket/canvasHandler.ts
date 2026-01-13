/**
 * Canvas Handler
 *
 * Handles canvas-wide operations (clear, cursor movement).
 */
import type { Server, Socket } from 'socket.io'
import type {
    ClientToServerEvents,
    ServerToClientEvents,
    SocketData,
} from '../types'
import { Stroke } from '../models'
import { roomManager } from '../utils/roomManager'

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>

export function setupCanvasHandlers(_io: TypedServer, socket: TypedSocket): void {
    /**
     * Handle canvas:clear
     * - Broadcast to all users in room
     * - Clear all strokes from database
     */
    socket.on('canvas:clear', async ({ roomId }) => {
        try {
            const userId = socket.data.userId

            if (!userId) {
                socket.emit('error', { message: 'Not authenticated' })
                return
            }

            // Broadcast to all users in the room (including sender for confirmation)
            socket.to(roomId).emit('canvas:cleared', { userId })

            // Clear all strokes for this room from database
            await Stroke.deleteMany({ roomId })

            console.log(`Canvas cleared in room ${roomId} by user ${userId}`)
        } catch (error) {
            console.error('Error in canvas:clear:', error)
            socket.emit('error', { message: 'Failed to clear canvas' })
        }
    })

    /**
     * Handle cursor:move
     * - Update cursor position in room manager
     * - Broadcast to others (throttled on client side)
     */
    socket.on('cursor:move', ({ roomId, cursor }) => {
        try {
            const userId = socket.data.userId

            if (!userId) return

            // Update cursor in room manager
            roomManager.updateCursor(roomId, userId, cursor)

            // Broadcast to other users
            socket.to(roomId).emit('cursor:moved', { userId, cursor })
        } catch (error) {
            console.error('Error in cursor:move:', error)
        }
    })

    /**
     * Handle canvas:undo
     * Note: Undo is handled client-side, this broadcasts the action
     */
    socket.on('canvas:undo', ({ roomId }) => {
        const userId = socket.data.userId
        if (!userId) return

        // For now, undo is local only
        // Could broadcast for sync if needed
        console.log(`Undo triggered in room ${roomId} by user ${userId}`)
    })

    /**
     * Handle canvas:redo
     * Note: Redo is handled client-side, this broadcasts the action
     */
    socket.on('canvas:redo', ({ roomId }) => {
        const userId = socket.data.userId
        if (!userId) return

        // For now, redo is local only
        // Could broadcast for sync if needed
        console.log(`Redo triggered in room ${roomId} by user ${userId}`)
    })
}
