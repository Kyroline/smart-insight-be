import { Router } from 'express'
import { index, show, store, update, destroy } from '../controllers/discussionController.js'

const router = Router()

router.get('/discussions', index)
router.get('/discussions/:id', show)
router.post('/discussions', store)
router.put('/discussions/:id', update)
router.delete('/discussions/:id', destroy)

export default router