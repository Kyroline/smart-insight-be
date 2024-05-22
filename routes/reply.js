import { Router } from 'express'
import { index, show, store, update, destroy, score, deleteScore } from '../controllers/replyController.js'

const router = Router()

router.post('/:id/score', score)
router.delete('/:id/score', deleteScore)

router.get('', index)
router.get('/:id', show)
router.post('', store)
router.put('/:id', update)
router.delete('/:id', destroy)


export default router