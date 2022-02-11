import { CreateBook } from '@/usecases/books'
import { HttpRequest, HttpResponse, HttpStatusCodes } from './types/http'

export class BookController {
  constructor (private readonly createBook: CreateBook) {}

  async create (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const response = await this.createBook.execute(body)
    return {
      httpStatusCode: HttpStatusCodes.created.code,
      body: response
    }
  }
}
