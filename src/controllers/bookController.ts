import { CreateBook } from '@/usecases/books'
import { HttpRequest, HttpResponse, HttpStatusCodes } from './types/http'

export class BookController {
  constructor (private readonly createBook: CreateBook) {}

  async create (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const response = await this.createBook.execute(body)
      return {
        httpStatusCode: HttpStatusCodes.created.code,
        body: response
      }
    } catch (error) {
      return {
        httpStatusCode: HttpStatusCodes.serverError.code,
        body: error.message
      }
    }
  }
}
