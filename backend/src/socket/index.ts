/**
 * Socket.IO Server Setup
 *
 * Initializes Socket.IO with all event handlers.
 */
import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import type {
    ClientToServerEvents,
    ServerToClientEvents,
    SocketData,
} from '../types'
import { config } from '../config'
import { setupRoomHandlers } from './roomHandler'
import { setupDrawingHandlers } from './drawingHandler'
import { setupCanvasHandlers } from './canvasHandler'

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>

export function initializeSocket(httpServer: HttpServer): TypedServer {
    const io: TypedServer = new Server(httpServer, {
        cors: {
            origin: config.corsOrigin,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
    })

    // Connection handler
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`)

        // Initialize socket data
        socket.data = {
            userId: '',
            userName: '',
            userColor: '',
            roomId: null,
        }

        // Setup all event handlers
        setupRoomHandlers(io, socket)
        setupDrawingHandlers(io, socket)
        setupCanvasHandlers(io, socket)

        // Log disconnection
        socket.on('disconnect', (reason) => {
            console.log(`Client disconnected: ${socket.id}, reason: ${reason}`)
        })
    })

    console.log('Socket.IO server initialized')

    return io
}

export default initializeSocket
