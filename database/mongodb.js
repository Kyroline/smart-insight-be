import mongoose from 'mongoose'

let conn

export async function connectDB() {
    try {
        if (!mongoose.connection.readyState) {
            conn = await mongoose.connect(
                process.env.MONGODB_CONNECTION_STRING
            )
            return console.log('Mongodb Connected')
        }
        return console.log('Using existing db')
    } catch (error) {
        console.error('error: ', error)
    }
}

export const connection = conn