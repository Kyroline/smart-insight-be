import { Router } from 'express'
import { index, show, store, update, destroy, enroll } from '../controllers/subjectController.js'

const router = Router()

router.get('/', index)
router.get('/:id', show)
router.post('', store)
router.put('/:id', update)
router.delete('/:id', destroy)

router.post('/:id/enroll', enroll)

export default router