import { Router } from 'express'
import { adaptRoute } from '../adapters/userExpressRouteAdapter'
import { makeUserController } from '../factories/makeUserController'
import { ensureAuthenticated } from '../middlewares/authMiddleware'

const userRouter = Router()

const userController = adaptRoute(makeUserController())

userRouter.post('/', userController.create)
userRouter.use(ensureAuthenticated)
userRouter.put('/', userController.update)
userRouter.delete('/', userController.delete)
userRouter.get('/:id', userController.show)

export default userRouter
