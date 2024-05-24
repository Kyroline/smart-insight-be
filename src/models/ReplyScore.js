import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
    {
        reply: { type: ObjectId },
        user: { type: ObjectId },
        score: {type: Number}
    }
)

const ReplyScore = mongoose.model('ReplyScore', schema)

export default ReplyScore