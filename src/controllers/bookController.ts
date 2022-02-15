import { CreateBook, ListBooks } from '@/usecases/books'
import { BookAlreadyExistsError } from '@/usecases/error'
import { HttpRequest, HttpResponse, HttpStatusCodes } from './types/http'

export class BookController {
  constructor (
    private readonly createBook: CreateBook,
    private readonly listBooks: ListBooks
  ) {}

  async create (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['title', 'author', 'createdAt', 'status']
      const isValid = requiredFields.every(field => httpRequest.body[field])
      if (!isValid) {
        return {
          httpStatusCode: HttpStatusCodes.badRequest.code,
          body: {
            message: 'Missing fields'
          }
        }
      }

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

  async index (): Promise<HttpResponse> {
    try {
      const response = await this.listBooks.execute()

      return {
        httpStatusCode: HttpStatusCodes.ok.code,
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
