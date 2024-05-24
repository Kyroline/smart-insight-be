import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    name: { type: String },
    teacher: { type: ObjectId },
    students: [{ type: ObjectId }]
})

const Subject = mongoose.model('Subject', schema)

export default Subject