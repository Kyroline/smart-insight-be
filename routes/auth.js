import { Router } from 'express'
import { login, register, validate } from '../controllers/authController.js'

const router = Router()

router.post('/auth/login', login)
router.post('/auth/register', register)
router.get('/auth/validate', validate)

export default router