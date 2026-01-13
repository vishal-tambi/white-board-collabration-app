/**
 * Drawing Handler
 *
 * Handles real-time stroke events for collaborative drawing.
 */
import type { Server, Socket } from 'socket.io'
import type {
    ClientToServerEvents,
    ServerToClientEvents,
    SocketData,
} from '../types'
import { Stroke } from '../models'

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>

export function setupDrawingHandlers(_io: TypedServer, socket: TypedSocket): void {
    /**
     * Handle stroke:start
     * - Broadcast to others in the room
     * - Save stroke to database
     */
    socket.on('stroke:start', async ({ roomId, stroke }) => {
        try {
            const userId = socket.data.userId

            if (!userId) {
                socket.emit('error', { message: 'Not authenticated' })
                return
            }

            // Broadcast to other users in the room
            socket.to(roomId).emit('stroke:started', { userId, stroke })

            // Save stroke to database
            await Stroke.create({
                roomId,
                strokeId: stroke.id,
                userId,
                points: stroke.points,
                color: stroke.color,
                size: stroke.size,
                tool: stroke.tool,
                timestamp: stroke.timestamp,
            })
        } catch (error) {
            console.error('Error in stroke:start:', error)
            socket.emit('error', { message: 'Failed to start stroke' })
        }
    })

    /**
     * Handle stroke:update
     * - Broadcast point update to others
     * - Update stroke in database (append point)
     */
    socket.on('stroke:update', async ({ roomId, strokeId, point }) => {
        try {
            const userId = socket.data.userId

            if (!userId) return

            // Broadcast to other users
            socket.to(roomId).emit('stroke:updated', { userId, strokeId, point })

            // Update stroke in database (append point)
            await Stroke.updateOne(
                { strokeId },
                { $push: { points: point } }
            )
        } catch (error) {
            console.error('Error in stroke:update:', error)
        }
    })

    /**
     * Handle stroke:end
     * - Broadcast completion to others
     */
    socket.on('stroke:end', ({ roomId, strokeId }) => {
        try {
            const userId = socket.data.userId

            if (!userId) return

            // Broadcast to other users
            socket.to(roomId).emit('stroke:ended', { userId, strokeId })
        } catch (error) {
            console.error('Error in stroke:end:', error)
        }
    })

    /**
     * Handle stroke:delete
     * - Broadcast deletion to others
     * - Remove from database
     */
    socket.on('stroke:delete', async ({ roomId, strokeId }) => {
        try {
            const userId = socket.data.userId

            if (!userId) return

            // Broadcast to other users
            socket.to(roomId).emit('stroke:deleted', { userId, strokeId })

            // Remove from database
            await Stroke.deleteOne({ strokeId })
        } catch (error) {
            console.error('Error in stroke:delete:', error)
        }
    })
}
