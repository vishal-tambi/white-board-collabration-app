/**
 * Snapshots API Routes
 *
 * Endpoints for saving and retrieving canvas snapshots.
 */
import { Router, Request, Response } from 'express'
import { Snapshot } from '../models'

const router = Router()

/**
 * POST /api/snapshots
 * Save a new snapshot
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { roomId, imageData, name, metadata } = req.body

        if (!roomId || !imageData) {
            return res.status(400).json({
                error: 'Missing required fields: roomId and imageData',
            })
        }

        const snapshot = new Snapshot({
            roomId,
            imageData,
            name,
            timestamp: Date.now(),
            metadata: metadata || {},
        })

        await snapshot.save()

        res.status(201).json({
            id: snapshot._id,
            roomId: snapshot.roomId,
            timestamp: snapshot.timestamp,
            name: snapshot.name,
        })
    } catch (error) {
        console.error('Error saving snapshot:', error)
        res.status(500).json({ error: 'Failed to save snapshot' })
    }
})

/**
 * GET /api/snapshots/:roomId
 * Get all snapshots for a room
 */
router.get('/:roomId', async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params
        const limit = parseInt(req.query.limit as string) || 20

        const snapshots = await Snapshot.find({ roomId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean()

        // Transform for frontend (match Snapshot interface)
        const formattedSnapshots = snapshots.map((s) => ({
            id: s._id.toString(),
            dataUrl: s.imageData,
            timestamp: s.timestamp,
            name: s.name,
        }))

        res.json({ snapshots: formattedSnapshots })
    } catch (error) {
        console.error('Error fetching snapshots:', error)
        res.status(500).json({ error: 'Failed to fetch snapshots' })
    }
})

/**
 * GET /api/snapshots/single/:id
 * Get a single snapshot by ID
 */
router.get('/single/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const snapshot = await Snapshot.findById(id).lean()

        if (!snapshot) {
            return res.status(404).json({ error: 'Snapshot not found' })
        }

        res.json({
            id: snapshot._id.toString(),
            dataUrl: snapshot.imageData,
            timestamp: snapshot.timestamp,
            name: snapshot.name,
            roomId: snapshot.roomId,
        })
    } catch (error) {
        console.error('Error fetching snapshot:', error)
        res.status(500).json({ error: 'Failed to fetch snapshot' })
    }
})

/**
 * DELETE /api/snapshots/:id
 * Delete a snapshot
 */
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const result = await Snapshot.findByIdAndDelete(id)

        if (!result) {
            return res.status(404).json({ error: 'Snapshot not found' })
        }

        res.json({ success: true, message: 'Snapshot deleted' })
    } catch (error) {
        console.error('Error deleting snapshot:', error)
        res.status(500).json({ error: 'Failed to delete snapshot' })
    }
})

export default router
