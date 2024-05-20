import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
    {
        subject: { type: ObjectId, required: true },
        user: { type: ObjectId, required: true },
        title: { type: String, required: true },
        content: { type: String, required: true },
        replyCount: { type: Number, default: 0 },
        attachments: [{
            name: { type: String },
            file: { type: String },
            type: { type: String }
        }],
        score: { type: Number, default: 0 }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })

const Discussion = mongoose.model('Discussion', schema)

export default Discussion