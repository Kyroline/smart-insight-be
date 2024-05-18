import { Router } from 'express'
import { index, show, store, update, destroy, enroll } from '../controllers/subjectController.js'

const router = Router()

router.get('/subjects', index)
router.get('/subjects/:id', show)
router.post('/subjects', store)
router.put('/subjects/:id', update)
router.delete('/subjects/:id', destroy)

router.post('/subjects/:id/enroll', enroll)

export default router