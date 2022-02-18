import { CreateBook, DeleteBook, ListBookById, ListBooks, UpdateBook } from '@/usecases/books'
import { BookAlreadyExistsError, BookNotFoundError, InvalidDataError } from '@/usecases/error'
import { HttpRequest, HttpResponse, HttpStatusCodes } from './types/http'

export class BookController {
  constructor (
    private readonly createBook: CreateBook,
    private readonly listBooks: ListBooks,
    private readonly listBookById: ListBookById,
    private readonly updateBook: UpdateBook,
    private readonly deleteBook: DeleteBook
  ) {}

  async create (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['title', 'author', 'status']
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

  async show (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params
      const response = await this.listBookById.execute(id)

      return {
        httpStatusCode: HttpStatusCodes.ok.code,
        body: response
      }
    } catch (error) {
      if (error instanceof BookNotFoundError) {
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

  async update (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params
      const requiredFields = ['title', 'author', 'status']
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
      const response = await this.updateBook.execute({ id, ...body })

      return {
        httpStatusCode: HttpStatusCodes.ok.code,
        body: response
      }
    } catch (error) {
      if (error instanceof BookNotFoundError || error instanceof InvalidDataError) {
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

  async delete (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params
      const response = await this.deleteBook.execute(id)

      return {
        httpStatusCode: HttpStatusCodes.ok.code,
        body: response
      }
    } catch (error) {
      if (error instanceof BookNotFoundError) {
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
