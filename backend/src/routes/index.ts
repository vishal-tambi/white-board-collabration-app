/**
 * Routes barrel export
 */
import { Router } from 'express'
import healthRouter from './health'
import roomsRouter from './rooms'
import snapshotsRouter from './snapshots'

const router = Router()

router.use('/health', healthRouter)
router.use('/rooms', roomsRouter)
router.use('/snapshots', snapshotsRouter)

export default router
