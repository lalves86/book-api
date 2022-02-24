import { HttpRequest } from '@/controllers/types/http'
import { UserController } from '@/controllers/userController'
import { Request, Response } from 'express'

export const adaptRoute = (controller: UserController) => {
  return {
    create: async (req: Request, res: Response): Promise<Response> => {
      const { body, params, query } = req
      const httpRequest: HttpRequest = {
        params,
        body,
        query
      }
      const httpResponse = await controller.create(httpRequest)
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    }
  }
}
