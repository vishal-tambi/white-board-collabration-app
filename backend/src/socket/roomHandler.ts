/**
 * Room Handler
 *
 * Handles room join/leave events and user presence.
 */
import type { Server, Socket } from 'socket.io'
import type {
    ClientToServerEvents,
    ServerToClientEvents,
    SocketData,
    RoomUser,
} from '../types'
import { roomManager } from '../utils/roomManager'
import { Room, Stroke } from '../models'

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>

export function setupRoomHandlers(io: TypedServer, socket: TypedSocket): void {
    /**
     * Handle room:join
     * - Add user to room
     * - Send existing users to new user
     * - Broadcast new user to others
     * - Send existing strokes for sync
     */
    socket.on('room:join', async ({ roomId, user }) => {
        try {
            // Store user info in socket data
            socket.data.userId = user.id
            socket.data.userName = user.name
            socket.data.userColor = user.color
            socket.data.roomId = roomId

            // Join the Socket.IO room
            await socket.join(roomId)

            // Add to room manager
            roomManager.addUser(roomId, user)

            // Ensure room exists in DB
            const existingRoom = await Room.findOne({ roomId })
            if (!existingRoom) {
                await Room.create({
                    roomId,
                    settings: { maxUsers: 50, isPrivate: false },
                })
            }

            // Get existing users in the room (excluding current user)
            const users = roomManager.getUsers(roomId)

            // Send current room state to the joining user
            socket.emit('room:joined', { users })

            // Get existing strokes for sync
            const strokes = await Stroke.find({ roomId })
                .sort({ timestamp: 1 })
                .lean()

            const formattedStrokes = strokes.map((s) => ({
                id: s.strokeId,
                points: s.points,
                color: s.color,
                size: s.size,
                tool: s.tool,
                timestamp: s.timestamp,
            }))

            // Send existing strokes to joining user
            socket.emit('canvas:strokes', { strokes: formattedStrokes })

            // Notify other users in the room
            socket.to(roomId).emit('room:user-joined', { user })

            console.log(`User ${user.name} (${user.id}) joined room ${roomId}`)
        } catch (error) {
            console.error('Error in room:join:', error)
            socket.emit('error', { message: 'Failed to join room' })
        }
    })

    /**
     * Handle room:leave
     * - Remove user from room
     * - Notify others
     */
    socket.on('room:leave', async ({ roomId }) => {
        try {
            const userId = socket.data.userId

            if (userId) {
                // Remove from room manager
                roomManager.removeUser(roomId, userId)

                // Leave the Socket.IO room
                await socket.leave(roomId)

                // Notify others
                socket.to(roomId).emit('room:user-left', { userId })

                // Clear socket data
                socket.data.roomId = null

                console.log(`User ${socket.data.userName} left room ${roomId}`)
            }
        } catch (error) {
            console.error('Error in room:leave:', error)
        }
    })

    /**
     * Handle disconnect
     * - Clean up user from all rooms
     */
    socket.on('disconnect', () => {
        const { userId, userName, roomId } = socket.data

        if (userId && roomId) {
            roomManager.removeUser(roomId, userId)
            socket.to(roomId).emit('room:user-left', { userId })
            console.log(`User ${userName} disconnected from room ${roomId}`)
        }
    })
}
