import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { generateToken, validateToken } from '../utils/jwt.js'

export const login = async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    let match = await bcrypt.compare(req.body.password, user.password)

    let userJson = user.toJSON()
    if (match) {
        delete userJson.password
        res.json({ token: generateToken(userJson) })
    } else {
        res.status(401).json({ message: 'Unauthenticated' })
    }
}

export const register = async (req, res) => {
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

export const validate = async (req, res) => {
    let [type, token] = req.headers['authorization'].split(' ')

    let user = await validateToken(token)
    res.json({ data: user })
}