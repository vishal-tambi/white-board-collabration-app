/**
 * Rooms API Routes
 *
 * Endpoints for room management and stroke retrieval.
 */
import { Router, Request, Response } from 'express'
import { nanoid } from 'nanoid'
import { Room, Stroke } from '../models'

const router = Router()

/**
 * POST /api/rooms
 * Create a new room with a unique ID
 */
router.post('/', async (_req: Request, res: Response) => {
    try {
        const roomId = nanoid(10) // Generate short unique ID

        const room = new Room({
            roomId,
            settings: {
                maxUsers: 50,
                isPrivate: false,
            },
        })

        await room.save()

        res.status(201).json({
            roomId: room.roomId,
            createdAt: room.createdAt,
            settings: room.settings,
        })
    } catch (error) {
        console.error('Error creating room:', error)
        res.status(500).json({ error: 'Failed to create room' })
    }
})

/**
 * GET /api/rooms/:roomId
 * Get room information
 */
router.get('/:roomId', async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params

        const room = await Room.findOne({ roomId })

        if (!room) {
            // Auto-create room if it doesn't exist (for direct URL access)
            const newRoom = new Room({
                roomId,
                settings: {
                    maxUsers: 50,
                    isPrivate: false,
                },
            })
            await newRoom.save()

            return res.json({
                roomId: newRoom.roomId,
                createdAt: newRoom.createdAt,
                settings: newRoom.settings,
                isNew: true,
            })
        }

        res.json({
            roomId: room.roomId,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
            settings: room.settings,
        })
    } catch (error) {
        console.error('Error fetching room:', error)
        res.status(500).json({ error: 'Failed to fetch room' })
    }
})

/**
 * GET /api/rooms/:roomId/strokes
 * Get all strokes for a room (for sync on join)
 */
router.get('/:roomId/strokes', async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params

        const strokes = await Stroke.find({ roomId })
            .sort({ timestamp: 1 })
            .lean()

        // Transform to match frontend Stroke type
        const formattedStrokes = strokes.map((s) => ({
            id: s.strokeId,
            points: s.points,
            color: s.color,
            size: s.size,
            tool: s.tool,
            timestamp: s.timestamp,
        }))

        res.json({ strokes: formattedStrokes })
    } catch (error) {
        console.error('Error fetching strokes:', error)
        res.status(500).json({ error: 'Failed to fetch strokes' })
    }
})

/**
 * DELETE /api/rooms/:roomId/strokes
 * Clear all strokes for a room
 */
router.delete('/:roomId/strokes', async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params

        await Stroke.deleteMany({ roomId })

        res.json({ success: true, message: 'All strokes cleared' })
    } catch (error) {
        console.error('Error clearing strokes:', error)
        res.status(500).json({ error: 'Failed to clear strokes' })
    }
})

export default router
