import { Router } from 'express'
import { login, register, validate } from '../controllers/authController.js'
import { isAuth } from '../middlewares/isAuth.js'

const router = Router()

router.post('/login', login)
router.post('/register', register)
router.get('/validate', isAuth, validate)

export default router