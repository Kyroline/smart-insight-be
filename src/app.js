import express from 'express'
import { connectDB } from './database/mongodb.js'
import apiRouter from './routes/api.js'
import cors from 'cors'
import errorMiddleware from './middlewares/error.js'
import fileUpload from 'express-fileupload'

connectDB()

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(express.json())

app.post('/api/v1/upload', fileUpload())
app.use('/api/v1', apiRouter)

// app.use('/api/v1/auth', authRouter)
// app.use('/api/v1/subjects', isAuth, subjectRouter)
// app.use('/api/v1/discussions', isAuth, discussionRouter)
// app.use('/api/v1/replies', isAuth, replyRouter)
// app.use('/api/v1/assignments', isAuth, assignmentRouter)
// app.use('/api/v1/submissions', isAuth, submissionRouter)

app.use(errorMiddleware)

export default app