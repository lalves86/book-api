import { BookController } from '@/controllers/bookController'
import { HttpRequest } from '@/controllers/types/http'
import { Request, Response } from 'express'

export const adaptRoute = (controller: BookController) => {
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
    index: async (req: Request, res: Response): Promise<Response> => {
      const httpResponse = await controller.index()
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    },
    show: async (req: Request, res: Response): Promise<Response> => {
      const { params } = req
      const httpRequest: HttpRequest = {
        params
      }
      const httpResponse = await controller.show(httpRequest)
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    },
    update: async (req: Request, res: Response): Promise<Response> => {
      const { body, query, params } = req
      const httpRequest: HttpRequest = {
        params,
        body,
        query
      }
      const httpResponse = await controller.update(httpRequest)
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    },
    delete: async (req: Request, res: Response): Promise<Response> => {
      const { params } = req
      const httpRequest: HttpRequest = {
        params
      }
      const httpResponse = await controller.delete(httpRequest)
      return res.status(httpResponse.httpStatusCode).json(httpResponse.body)
    }
  }
}
