import { Router } from 'express'
import multer from 'multer'
import { ensureAuthenticated } from '@/main/middlewares/authMiddleware'
import { adaptRoute } from '../adapters/bookExpressRouteAdapter'
import { makeBookController } from '../factories/makeBookController'
import uploadConfig from '@/main/config/multerConfig'

const upload = multer(uploadConfig)

const bookRouter = Router()

const bookController = adaptRoute(makeBookController())

bookRouter.get('/', bookController.index)
bookRouter.use(ensureAuthenticated)
bookRouter.get('/self', bookController.listByUserId)
bookRouter.post('/', bookController.create)
bookRouter.post('/:id', upload.single('image'), bookController.uploadImage)
bookRouter.get('/:id', bookController.show)
bookRouter.put('/:id', bookController.update)
bookRouter.delete('/:id', bookController.delete)

export default bookRouter
