import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
    {
        subject: { type: ObjectId },
        name: { type: String },
        description: { type: String},
        deadline: { type: Date }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const Assignment = mongoose.model('Assignment', schema)

export default Assignment