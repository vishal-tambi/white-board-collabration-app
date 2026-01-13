/**
 * Stroke Model
 *
 * Represents a single stroke/drawing on the canvas.
 * Stored for persistence and sync when users join a room.
 */
import mongoose, { Document, Schema } from 'mongoose'

export interface IPoint {
    x: number
    y: number
    pressure?: number
}

export interface IStroke extends Document {
    roomId: string
    strokeId: string
    userId: string
    points: IPoint[]
    color: string
    size: number
    tool: 'pen' | 'eraser' | 'select'
    timestamp: number
}

const PointSchema = new Schema<IPoint>(
    {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        pressure: { type: Number },
    },
    { _id: false }
)

const StrokeSchema = new Schema<IStroke>(
    {
        roomId: {
            type: String,
            required: true,
            index: true,
        },
        strokeId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: String,
            required: true,
        },
        points: {
            type: [PointSchema],
            required: true,
        },
        color: {
            type: String,
            required: true,
            default: '#000000',
        },
        size: {
            type: Number,
            required: true,
            default: 8,
        },
        tool: {
            type: String,
            enum: ['pen', 'eraser', 'select'],
            required: true,
            default: 'pen',
        },
        timestamp: {
            type: Number,
            required: true,
            default: () => Date.now(),
        },
    },
    {
        timestamps: true,
    }
)

// Compound index for efficient room queries
StrokeSchema.index({ roomId: 1, timestamp: 1 })

export const Stroke = mongoose.model<IStroke>('Stroke', StrokeSchema)
export default Stroke
