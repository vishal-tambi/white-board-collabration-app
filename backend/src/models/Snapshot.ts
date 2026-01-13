/**
 * Snapshot Model
 *
 * Represents a saved canvas snapshot (as base64 image data).
 */
import mongoose, { Document, Schema } from 'mongoose'

export interface ISnapshot extends Document {
    roomId: string
    imageData: string
    timestamp: number
    name?: string
    metadata: {
        userCount?: number
        strokeCount?: number
    }
}

const SnapshotSchema = new Schema<ISnapshot>(
    {
        roomId: {
            type: String,
            required: true,
            index: true,
        },
        imageData: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Number,
            required: true,
            default: () => Date.now(),
        },
        name: {
            type: String,
        },
        metadata: {
            userCount: {
                type: Number,
            },
            strokeCount: {
                type: Number,
            },
        },
    },
    {
        timestamps: true,
    }
)

// Index for fetching snapshots by room
SnapshotSchema.index({ roomId: 1, timestamp: -1 })

export const Snapshot = mongoose.model<ISnapshot>('Snapshot', SnapshotSchema)
export default Snapshot
