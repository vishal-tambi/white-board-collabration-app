import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import type {
    ClientToServerEvents,
    ServerToClientEvents,
    RoomUser,
    Stroke,
    Point,
} from '@/types'
import { useCanvasStore } from '@/stores/canvasStore'

/**
 * useRoom Hook
 *
 * Manages Socket.IO connection, room joining, and real-time stroke sync.
 */

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

// Generate random user color
function getRandomColor(): string {
    const colors = [
        '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E',
        '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
        '#A855F7', '#D946EF', '#EC4899', '#F43F5E',
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}

// Generate random user name
function getRandomName(): string {
    const adjectives = ['Creative', 'Artistic', 'Swift', 'Clever', 'Bright']
    const nouns = ['Artist', 'Designer', 'Creator', 'Maker', 'Drawer']
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    return `${adj} ${noun}`
}

interface UseRoomReturn {
    status: ConnectionStatus
    users: RoomUser[]
    currentUser: RoomUser | null
    emitStrokeStart: (stroke: Stroke) => void
    emitStrokeUpdate: (strokeId: string, point: Point) => void
    emitStrokeEnd: (strokeId: string) => void
    emitCanvasClear: () => void
}

export function useRoom(roomId: string | undefined): UseRoomReturn {
    const socketRef = useRef<TypedSocket | null>(null)
    const [status, setStatus] = useState<ConnectionStatus>('disconnected')
    const [users, setUsers] = useState<RoomUser[]>([])
    const [currentUser, setCurrentUser] = useState<RoomUser | null>(null)

    const loadStrokes = useCanvasStore((state) => state.loadStrokes)
    const addRemoteStroke = useCanvasStore((state) => state.addRemoteStroke)
    const updateRemoteStroke = useCanvasStore((state) => state.updateRemoteStroke)
    const endRemoteStroke = useCanvasStore((state) => state.endRemoteStroke)
    const clearCanvas = useCanvasStore((state) => state.clear)

    // Initialize socket and join room
    useEffect(() => {
        if (!roomId) return

        setStatus('connecting')

        // Create socket connection
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        }) as TypedSocket

        socketRef.current = socket

        // Create user identity
        const user: RoomUser = {
            id: nanoid(8),
            name: getRandomName(),
            color: getRandomColor(),
        }
        setCurrentUser(user)

        // Connection events
        socket.on('connect', () => {
            console.log('Socket connected, joining room:', roomId)
            setStatus('connected')

            // Join the room
            socket.emit('room:join', { roomId, user })
            toast.success('Connected to room!', {
                description: `Joined as ${user.name}`,
            })
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected')
            setStatus('disconnected')
            toast.error('Disconnected from room')
        })

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error)
            setStatus('error')
            toast.error('Connection failed', {
                description: 'Could not connect to server',
            })
        })

        // Room events
        socket.on('room:joined', ({ users }) => {
            console.log('Joined room, users:', users)
            setUsers(users)
        })

        socket.on('room:user-joined', ({ user }) => {
            console.log('User joined:', user.name)
            setUsers((prev) => [...prev, user])
            toast.info(`${user.name} joined the room`)
        })

        socket.on('room:user-left', ({ userId }) => {
            setUsers((prev) => {
                const user = prev.find((u) => u.id === userId)
                if (user) {
                    toast.info(`${user.name} left the room`)
                }
                return prev.filter((u) => u.id !== userId)
            })
        })

        // Stroke sync - receive existing strokes when joining
        socket.on('canvas:strokes', ({ strokes }) => {
            console.log('Received existing strokes:', strokes.length)
            loadStrokes(strokes)
        })

        // Real-time drawing events from other users
        socket.on('stroke:started', ({ userId, stroke }) => {
            console.log('Remote stroke started:', userId, stroke.id)
            addRemoteStroke(stroke)
        })

        socket.on('stroke:updated', ({ strokeId, point }) => {
            updateRemoteStroke(strokeId, point)
        })

        socket.on('stroke:ended', ({ strokeId }) => {
            endRemoteStroke(strokeId)
        })

        socket.on('canvas:cleared', ({ userId }) => {
            console.log('Canvas cleared by:', userId)
            clearCanvas()
        })

        socket.on('error', ({ message }) => {
            console.error('Socket error:', message)
            toast.error('Error', { description: message })
        })

        // Cleanup on unmount
        return () => {
            if (socket.connected) {
                socket.emit('room:leave', { roomId })
            }
            socket.disconnect()
            socketRef.current = null
        }
    }, [roomId, loadStrokes, addRemoteStroke, updateRemoteStroke, endRemoteStroke, clearCanvas])

    // Emit stroke start
    const emitStrokeStart = useCallback(
        (stroke: Stroke) => {
            if (socketRef.current?.connected && roomId) {
                socketRef.current.emit('stroke:start', { roomId, stroke })
            }
        },
        [roomId]
    )

    // Emit stroke update (new point)
    const emitStrokeUpdate = useCallback(
        (strokeId: string, point: Point) => {
            if (socketRef.current?.connected && roomId) {
                socketRef.current.emit('stroke:update', { roomId, strokeId, point })
            }
        },
        [roomId]
    )

    // Emit stroke end
    const emitStrokeEnd = useCallback(
        (strokeId: string) => {
            if (socketRef.current?.connected && roomId) {
                socketRef.current.emit('stroke:end', { roomId, strokeId })
            }
        },
        [roomId]
    )

    // Emit canvas clear
    const emitCanvasClear = useCallback(() => {
        if (socketRef.current?.connected && roomId) {
            socketRef.current.emit('canvas:clear', { roomId })
        }
    }, [roomId])

    return {
        status,
        users,
        currentUser,
        emitStrokeStart,
        emitStrokeUpdate,
        emitStrokeEnd,
        emitCanvasClear,
    }
}
