import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    discussion: { type: ObjectId },
    parent: { type: ObjectId },
    user: { type: ObjectId },
    content: { type: String },
    replyCount: { type: Number },
    attachments: [{
        name: { type: String },
        file: { type: String },
        type: { type: String }
    }],
    like: { type: Number },
    dislike: { type: Number }
});

const Reply = mongoose.model('Reply', schema)

export default Reply