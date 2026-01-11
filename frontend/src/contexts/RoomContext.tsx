import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { nanoid } from 'nanoid'
import { useSocket } from '@/hooks/useSocket'
import type { RoomUser, SocketStatus, Stroke } from '@/types'

/**
 * RoomContext
 *
 * Manages room state and real-time collaboration.
 * Provides user presence, remote cursors, and sync status.
 */

interface RemoteCursor {
  x: number
  y: number
}

interface RoomContextValue {
  // Room info
  roomId: string | null
  isInRoom: boolean

  // Current user
  currentUser: RoomUser | null

  // Remote users
  users: RoomUser[]
  remoteCursors: Map<string, RemoteCursor>

  // Connection
  connectionStatus: SocketStatus
  isConnected: boolean

  // Actions
  joinRoom: (roomId: string, userName?: string) => void
  leaveRoom: () => void
  updateCursor: (x: number, y: number) => void

  // Stroke sync (for future use)
  syncStroke: (stroke: Stroke) => void
}

const RoomContext = createContext<RoomContextValue | undefined>(undefined)

// Generate random color for user avatar
function generateUserColor(): string {
  const colors = [
    '#EF4444',
    '#F97316',
    '#EAB308',
    '#22C55E',
    '#06B6D4',
    '#3B82F6',
    '#8B5CF6',
    '#EC4899',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

interface RoomProviderProps {
  children: ReactNode
}

export function RoomProvider({ children }: RoomProviderProps) {
  const { socket, status, connect, isConnected } = useSocket()

  const [roomId, setRoomId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<RoomUser | null>(null)
  const [users, setUsers] = useState<RoomUser[]>([])
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(
    new Map()
  )

  // Join a room
  const joinRoom = useCallback(
    (newRoomId: string, userName?: string) => {
      if (!socket) return

      // Create user
      const user: RoomUser = {
        id: nanoid(),
        name: userName || `User ${Math.floor(Math.random() * 1000)}`,
        color: generateUserColor(),
      }

      setCurrentUser(user)
      setRoomId(newRoomId)

      // Connect and join
      connect()
      socket.emit('room:join', { roomId: newRoomId, user })
    },
    [socket, connect]
  )

  // Leave room
  const leaveRoom = useCallback(() => {
    if (!socket || !roomId) return

    socket.emit('room:leave', { roomId })
    setRoomId(null)
    setCurrentUser(null)
    setUsers([])
    setRemoteCursors(new Map())
  }, [socket, roomId])

  // Update cursor position
  const updateCursor = useCallback(
    (x: number, y: number) => {
      if (!socket || !roomId) return

      socket.emit('cursor:move', { roomId, cursor: { x, y } })
    },
    [socket, roomId]
  )

  // Sync stroke to other users
  const syncStroke = useCallback(
    (stroke: Stroke) => {
      if (!socket || !roomId) return

      socket.emit('stroke:start', { roomId, stroke })
    },
    [socket, roomId]
  )

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    // Room joined - receive user list
    socket.on('room:joined', ({ users: roomUsers }) => {
      setUsers(roomUsers.filter((u) => u.id !== currentUser?.id))
    })

    // New user joined
    socket.on('room:user-joined', ({ user }) => {
      setUsers((prev) => [...prev, user])
    })

    // User left
    socket.on('room:user-left', ({ userId }) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setRemoteCursors((prev) => {
        const next = new Map(prev)
        next.delete(userId)
        return next
      })
    })

    // Cursor moved
    socket.on('cursor:moved', ({ userId, cursor }) => {
      setRemoteCursors((prev) => {
        const next = new Map(prev)
        next.set(userId, cursor)
        return next
      })
    })

    return () => {
      socket.off('room:joined')
      socket.off('room:user-joined')
      socket.off('room:user-left')
      socket.off('cursor:moved')
    }
  }, [socket, currentUser?.id])

  const value: RoomContextValue = {
    roomId,
    isInRoom: !!roomId,
    currentUser,
    users,
    remoteCursors,
    connectionStatus: status,
    isConnected,
    joinRoom,
    leaveRoom,
    updateCursor,
    syncStroke,
  }

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}

export function useRoom() {
  const context = useContext(RoomContext)
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider')
  }
  return context
}
