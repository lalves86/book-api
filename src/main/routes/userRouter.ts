import { Router } from 'express'
import { adaptRoute } from '../adapters/userExpressRouteAdapter'
import { makeUserController } from '../factories/makeUserController'

const userRouter = Router()

const userController = adaptRoute(makeUserController())

userRouter.post('/', userController.create)
userRouter.get('/:id', userController.show)

export default userRouter
