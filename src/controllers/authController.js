import bcrypt from 'bcrypt'
import { ErrorResponse } from '../utils/errors.js'
import User from '../models/User.js'
import { generateToken, validateToken } from '../utils/jwt.js'

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select('+password')
        if (!user)
            throw new ErrorResponse(401, 'Unauthenticated')

        let match = await bcrypt.compare(req.body.password, user.password)

        let userJson = user.toJSON()
        if (!match)
            throw new ErrorResponse(401, 'Unauthenticated')

        delete userJson.password
        
        return res.json({ user: userJson, token: generateToken(userJson) })
    } catch (error) {
        next(error)
    }
}

export const register = async (req, res, next) => {
    let password = await bcrypt.hash(req.body.password, 10)

    const user = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: password
    })

    let userJson = user.toJSON()

    delete userJson.password
    res.json({ user: userJson, token: generateToken(userJson) })
}

export const validate = async (req, res, next) => {
    try {
        let [type, token] = req.headers['authorization'].split(' ')

        let user = await validateToken(token)
        res.json({ data: user })
    } catch (error) {
        next(error)
    }
}