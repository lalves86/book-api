import { adaptMiddleware } from '../adapters/authMiddlewareExpressAdapter'
import { makeAuthMiddleware } from '../factories/makeAuthMiddleware'

export const ensureAuthenticated = adaptMiddleware(makeAuthMiddleware())
