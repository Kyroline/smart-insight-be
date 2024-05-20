import { Router } from 'express'
import { index, show, store, update, destroy, score } from '../controllers/discussionController.js'

const router = Router()

router.post('/:id/score', score)

router.get('', index)
router.get('/:id', show)
router.post('', store)
router.put('/:id', update)
router.delete('/:id', destroy)


export default router