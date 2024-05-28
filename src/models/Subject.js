import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    name: { type: String },
    teacher: { type: ObjectId },
    students: [{ type: ObjectId }],
    material_count: { type: Number, default: 0 },
    assignment_count: { type: Number, default: 0 },
    student_count: { type: Number, default: 0 },
})

const Subject = mongoose.model('Subject', schema)

export default Subject