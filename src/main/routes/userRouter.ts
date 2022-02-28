import { Router } from 'express'
import { adaptRoute } from '../adapters/userExpressRouteAdapter'
import { makeUserController } from '../factories/makeUserController'
import { ensureAuthenticated } from '../middlewares/authMiddleware'

const userRouter = Router()

const userController = adaptRoute(makeUserController())

userRouter.post('/', userController.create)
userRouter.use(ensureAuthenticated)
userRouter.get('/:id', userController.show)

export default userRouter
