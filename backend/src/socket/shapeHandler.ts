/**
 * Shape Handler
 *
 * Handles real-time shape events for collaborative drawing.
 * Shapes include: rectangle, circle, arrow, line
 */
import type { Server, Socket } from 'socket.io'
import type {
    ClientToServerEvents,
    ServerToClientEvents,
    SocketData,
} from '../types'

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>

export function setupShapeHandlers(_io: TypedServer, socket: TypedSocket): void {
    /**
     * Handle shape:start
     * - Broadcast to others in the room
     */
    socket.on('shape:start', ({ roomId, shape }) => {
        try {
            const userId = socket.data.userId

            if (!userId) {
                socket.emit('error', { message: 'Not authenticated' })
                return
            }

            // Broadcast to other users in the room
            socket.to(roomId).emit('shape:started', { userId, shape })

            console.log(`Shape ${shape.id} (${shape.shapeType}) started in room ${roomId} by ${userId}`)
        } catch (error) {
            console.error('Error in shape:start:', error)
            socket.emit('error', { message: 'Failed to start shape' })
        }
    })

    /**
     * Handle shape:update
     * - Broadcast endpoint update to others
     */
    socket.on('shape:update', ({ roomId, shapeId, endPoint }) => {
        try {
            const userId = socket.data.userId

            if (!userId) return

            // Broadcast to other users
            socket.to(roomId).emit('shape:updated', { userId, shapeId, endPoint })
        } catch (error) {
            console.error('Error in shape:update:', error)
        }
    })

    /**
     * Handle shape:end
     * - Broadcast completion to others
     */
    socket.on('shape:end', ({ roomId, shapeId }) => {
        try {
            const userId = socket.data.userId

            if (!userId) return

            // Broadcast to other users
            socket.to(roomId).emit('shape:ended', { userId, shapeId })

            console.log(`Shape ${shapeId} completed in room ${roomId} by ${userId}`)
        } catch (error) {
            console.error('Error in shape:end:', error)
        }
    })
}
