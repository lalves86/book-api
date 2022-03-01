import { HttpRequest } from '@/presentation/types/http'
import { UserController } from '@/presentation/controllers/userController'
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
    },
    show: async (req: Request, res: Response): Promise<Response> => {
      const { params, query } = req
      const httpRequest: HttpRequest = {
        params,
        query
      }
      const httpResponse = await controller.show(httpRequest)
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    },
    update: async (req: Request, res: Response): Promise<Response> => {
      const { body, userId } = req
      const httpRequest: HttpRequest = {
        body,
        userId
      }
      const httpResponse = await controller.update(httpRequest)
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    },
    delete: async (req: Request, res: Response): Promise<Response> => {
      const { userId } = req
      const httpRequest: HttpRequest = {
        userId
      }
      const httpResponse = await controller.delete(httpRequest)
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    }
  }
}
