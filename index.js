import express from 'express'
import subjectRouter from './routes/subject.js'
import discussionRouter from './routes/discussion.js'
import replyRouter from './routes/reply.js'
import authRouter from './routes/auth.js'
import connectDB from './database/mongodb.js'
import { isAuth } from './middlewares/isAuth.js'

connectDB()
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())

app.use('/api/v1', isAuth, subjectRouter)
app.use('/api/v1', isAuth, discussionRouter)
app.use('/api/v1', isAuth, replyRouter)
app.use('/api/v1', authRouter)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})