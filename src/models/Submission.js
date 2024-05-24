import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
    {
        assignment: { type: ObjectId, required: true },
        student: { type: String, required: true },
        submitted_at: { type: Date, default: Date.now() },
        description: { type: String },
        file_url: { type: String, required: true },
        grade: { type: Number, default: null },
        note: { type: String, default: null }
    }
)

const Submission = mongoose.model('Submission', schema)

export default Submission