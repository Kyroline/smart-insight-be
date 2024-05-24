import { validateToken } from '../utils/jwt.js'

const authMiddleware = async (req, res, next) => {
    try {
        let [type, token] = req.headers['authorization'].split(' ')

        if (!token || token == '')
            throw error

        let user = await validateToken(token)
        req.user = user
        next()
    } catch (error) {
        res.status(401).json({ message: 'Unauthenticated' })
    }
}

export default authMiddleware