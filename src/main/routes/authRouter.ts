import { Router } from 'express'
import { adaptRoute } from '../adapters/authExpressRouteAdapter'
import { makeAuthController } from '../factories/makeAuthController'

const authRouter = Router()

const authController = adaptRoute(makeAuthController())

authRouter.post('/login', authController.login)

export default authRouter
