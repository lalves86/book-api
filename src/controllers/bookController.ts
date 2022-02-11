import { CreateBook } from '@/usecases/books'
import { HttpRequest, HttpResponse } from './types/http'

export class BookController {
  constructor (private readonly createBook: CreateBook) {}

  async create (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { body } = httpRequest
    const response = await this.createBook.execute(body)
    return {
      httpStatusCode: 201,
      body: response
    }
  }
}
