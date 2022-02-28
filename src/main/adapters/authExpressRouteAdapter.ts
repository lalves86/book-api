import { Request, Response } from 'express'
import { AuthController } from '@/controllers/authController'
import { HttpRequest } from '@/controllers/types/http'

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
