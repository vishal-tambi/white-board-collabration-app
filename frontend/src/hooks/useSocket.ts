import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketStatus,
} from '@/types'

/**
 * useSocket Hook
 *
 * Manages Socket.IO connection with automatic reconnection.
 * Provides typed socket instance and connection status.
 */

type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>

interface UseSocketOptions {
  url?: string
  autoConnect?: boolean
}

interface UseSocketReturn {
  socket: TypedSocket | null
  status: SocketStatus
  connect: () => void
  disconnect: () => void
  isConnected: boolean
}

const DEFAULT_SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const { url = DEFAULT_SOCKET_URL, autoConnect = false } = options

  const socketRef = useRef<TypedSocket | null>(null)
  const [status, setStatus] = useState<SocketStatus>('disconnected')

  // Initialize socket
  useEffect(() => {
    const socket = io(url, {
      autoConnect,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }) as TypedSocket

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      setStatus('connected')
    })

    socket.on('disconnect', () => {
      setStatus('disconnected')
    })

    socket.on('connect_error', () => {
      setStatus('error')
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [url, autoConnect])

  const connect = useCallback(() => {
    if (socketRef.current && !socketRef.current.connected) {
      setStatus('connecting')
      socketRef.current.connect()
    }
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current?.connected) {
      socketRef.current.disconnect()
    }
  }, [])

  return {
    socket: socketRef.current,
    status,
    connect,
    disconnect,
    isConnected: status === 'connected',
  }
}
