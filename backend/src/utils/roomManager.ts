/**
 * Room Manager Utility
 *
 * In-memory storage for active room users.
 * Used for real-time presence tracking without DB queries.
 */
import type { RoomUser } from '../types'

interface ActiveRoom {
    users: Map<string, RoomUser>
    createdAt: number
}

class RoomManager {
    private rooms: Map<string, ActiveRoom> = new Map()

    /**
     * Add a user to a room
     */
    addUser(roomId: string, user: RoomUser): void {
        let room = this.rooms.get(roomId)

        if (!room) {
            room = {
                users: new Map(),
                createdAt: Date.now(),
            }
            this.rooms.set(roomId, room)
        }

        room.users.set(user.id, user)
    }

    /**
     * Remove a user from a room
     */
    removeUser(roomId: string, userId: string): void {
        const room = this.rooms.get(roomId)
        if (!room) return

        room.users.delete(userId)

        // Clean up empty rooms
        if (room.users.size === 0) {
            this.rooms.delete(roomId)
        }
    }

    /**
     * Get all users in a room
     */
    getUsers(roomId: string): RoomUser[] {
        const room = this.rooms.get(roomId)
        return room ? Array.from(room.users.values()) : []
    }

    /**
     * Get a specific user
     */
    getUser(roomId: string, userId: string): RoomUser | undefined {
        const room = this.rooms.get(roomId)
        return room?.users.get(userId)
    }

    /**
     * Update user cursor position
     */
    updateCursor(roomId: string, userId: string, cursor: { x: number; y: number }): void {
        const room = this.rooms.get(roomId)
        const user = room?.users.get(userId)

        if (user) {
            user.cursor = cursor
        }
    }

    /**
     * Check if room exists
     */
    roomExists(roomId: string): boolean {
        return this.rooms.has(roomId)
    }

    /**
     * Get room user count
     */
    getUserCount(roomId: string): number {
        const room = this.rooms.get(roomId)
        return room?.users.size || 0
    }

    /**
     * Get all active room IDs
     */
    getActiveRooms(): string[] {
        return Array.from(this.rooms.keys())
    }
}

// Singleton instance
export const roomManager = new RoomManager()
export default roomManager
