import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profile_picture: { type: String, default: null }
})

const User = mongoose.model('User', schema)

export default User