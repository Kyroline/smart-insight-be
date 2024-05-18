import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    subject: { type: ObjectId },
    user: { type: ObjectId },
    title: { type: String },
    content: { type: String },
    replyCount: { type: Number },
    attachments: [{
        name: { type: String },
        file: { type: String },
        type: { type: String }
    }],
    like: { type: Number },
    dislike: { type: Number }
})

const Discussion = mongoose.model('Discussion', schema)

export default Discussion