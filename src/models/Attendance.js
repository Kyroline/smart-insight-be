import { ObjectId } from 'mongodb'
import mongoose, { Schema } from 'mongoose'

const schema = new Schema(
    {
        subject: { type: ObjectId },
        teacher: { type: ObjectId },
        name: { type: String },
        deadline: { type: Date },
        present_students: [{ type: ObjectId }]
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const Attendance = mongoose.model('Attendance', schema)

export default Attendance