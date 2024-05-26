import { ErrorResponse } from '../utils/errors.js'

const DEBUG_MODE = process.env.DEBUG_MODE || 1

const errorMiddleware = (err, req, res, next) => {
    if (!err)
        next()

    if (err instanceof ErrorResponse)
        return res.status(err.code).json({ message: err.message })

    if (DEBUG_MODE)
        return res.status(500).json(err)
    else
        return res.status(500).json({ message: 'Unexpected Error' })
}

export default errorMiddleware 