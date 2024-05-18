import { Router } from 'express'
import { index, show, store, update, destroy } from '../controllers/replyController.js'

const router = Router()

router.get('/replies', index)
router.get('/replies/:id', show)
router.post('/replies', store)
router.put('/replies/:id', update)
router.delete('/replies/:id', destroy)

export default router