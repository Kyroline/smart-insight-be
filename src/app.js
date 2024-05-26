import express from 'express'
import { connectDB } from './database/mongodb.js'
import apiRouter from './routes/api.js'
import cors from 'cors'
import errorMiddleware from './middlewares/error.js'

connectDB()

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(express.json())

app.use('/api/v1', apiRouter)

app.use(errorMiddleware)

export default app