import mongoose from 'mongoose'

async function connectDB() {
    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(
                process.env.MONGODB_CONNECTION_STRING
            )
            return console.log('Mongodb Connected')
        }
        return console.log('Using existing db')
    } catch (error) {
        console.error('error: ', error)
    }
}

export default connectDB;