import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
    {
        discussion: { type: ObjectId },
        user: { type: ObjectId },
        score: { type: Number }
    }
)

const DiscussionScore = mongoose.model('DiscussionScore', schema)

export default DiscussionScore