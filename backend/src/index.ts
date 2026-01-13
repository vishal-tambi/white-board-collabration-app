/**
 * Whiteboard Backend Server
 *
 * Main entry point for the collaborative whiteboard backend.
 * Initializes Express, Socket.IO, and MongoDB.
 */
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import mongoose from 'mongoose'

import { config } from './config'
import routes from './routes'
import { initializeSocket } from './socket'

// Create Express app
const app = express()
const httpServer = createServer(app)

// Middleware
app.use(cors({
    origin: config.corsOrigin,
    credentials: true,
}))
app.use(express.json({ limit: '50mb' })) // Large limit for base64 images
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/api', routes)

// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        name: 'Whiteboard Backend',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/api/health',
            rooms: '/api/rooms',
            snapshots: '/api/snapshots',
        },
    })
})

// Initialize Socket.IO
initializeSocket(httpServer)

// MongoDB connection with retry logic
async function connectToDatabase(retries = 5): Promise<void> {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(config.mongodbUri)
            console.log('✅ Connected to MongoDB')
            return
        } catch (error) {
            console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, error)
            if (i < retries - 1) {
                console.log(`Retrying in 5 seconds...`)
                await new Promise((resolve) => setTimeout(resolve, 5000))
            }
        }
    }
    console.error('❌ Failed to connect to MongoDB after all retries')
    process.exit(1)
}

// MongoDB connection events
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected')
})

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...')
    await mongoose.connection.close()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down server...')
    await mongoose.connection.close()
    process.exit(0)
})

// Start server
async function startServer(): Promise<void> {
    await connectToDatabase()

    httpServer.listen(config.port, () => {
        console.log(`
🚀 Whiteboard Backend Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running on port ${config.port}
🔧 Environment: ${config.nodeEnv}
🔗 API: http://localhost:${config.port}/api
🔌 Socket.IO: ws://localhost:${config.port}
📊 Health: http://localhost:${config.port}/api/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `)
    })
}

startServer().catch(console.error)
