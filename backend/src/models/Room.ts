/**
 * Room Model
 *
 * Represents a whiteboard session room.
 */
import mongoose, { Document, Schema } from 'mongoose'

export interface IRoom extends Document {
    roomId: string
    createdAt: Date
    updatedAt: Date
    settings: {
        maxUsers?: number
        isPrivate?: boolean
    }
}

const RoomSchema = new Schema<IRoom>(
    {
        roomId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        settings: {
            maxUsers: {
                type: Number,
                default: 50,
            },
            isPrivate: {
                type: Boolean,
                default: false,
            },
        },
    },
    {
        timestamps: true,
    }
)

export const Room = mongoose.model<IRoom>('Room', RoomSchema)
export default Room
