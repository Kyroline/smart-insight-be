import { Router } from 'express'
import { index, show, store, update, destroy, getAsStudent, getAsTeacher } from '../controllers/assignmentController.js'

const router = Router()

router.get('/students', getAsStudent)
router.get('/teachers', getAsTeacher)

router.get('', index)
router.get('/:id', show)
router.post('', store)
router.put('/:id', update)
router.delete('/:id', destroy)


export default router