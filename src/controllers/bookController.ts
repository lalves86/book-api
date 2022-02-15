import { CreateBook } from '@/usecases/books'
import { BookAlreadyExistsError } from '@/usecases/error'
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
      if (error instanceof BookAlreadyExistsError) {
        return {
          httpStatusCode: HttpStatusCodes.badRequest.code,
          body: {
            message: error.message
          }
        }
      }

      return {
        httpStatusCode: HttpStatusCodes.serverError.code,
        body: error.message
      }
    }
  }
}
