import { Router } from 'express'
import { adaptRoute } from './adapters/expressRouteAdapter'
import { makeBookController } from './factories/makeBookController'

const router = Router()

const bookController = adaptRoute(makeBookController())

router.post('/books', bookController.create)
router.get('/books', bookController.index)
router.get('/books/:id', bookController.show)
router.put('/books/:id', bookController.update)
router.delete('/books/:id', bookController.delete)

export default router
