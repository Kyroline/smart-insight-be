import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
    {
        discussion: { type: ObjectId, required: true },
        parent: { type: ObjectId, default: null },
        user: { type: ObjectId, required: true },
        content: { type: String, required: true },
        replyCount: { type: Number, default: 0 },
        attachments: [{
            name: { type: String },
            type: { type: String },
            value: { type: String },
        }],
        score: { type: Number, default: 0 }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const Reply = mongoose.model('Reply', schema)

export default Reply