import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
    {
        subject: { type: ObjectId },
        teacher: { type: ObjectId },
        name: { type: String },
        description: { type: String },
        attachments: [{
            name: { type: String },
            type: { type: String },
            value: { type: String },
        }],
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const Material = mongoose.model('Material', schema)

export default Material