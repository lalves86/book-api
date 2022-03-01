import { Request, Response } from 'express'
import { AuthController } from '@/presentation/controllers/authController'
import { HttpRequest } from '@/presentation/types/http'

export const adaptRoute = (controller: AuthController) => {
  return {
    login: async (req: Request, res: Response): Promise<Response> => {
      const { body, params, query, userId } = req
      const httpRequest: HttpRequest = {
        params,
        body,
        query,
        userId
      }
      const httpResponse = await controller.login(httpRequest)
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    }
  }
}
