import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    password: { type: String }
})

const User = mongoose.model('User', schema)

export default User