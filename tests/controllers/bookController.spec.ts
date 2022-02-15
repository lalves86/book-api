import Mockdate from 'mockdate'
import { BookController } from '@/controllers/bookController'
import { HttpStatusCodes } from '@/controllers/types/http'
import { CreateBook, ListBooks } from '@/usecases/books'
import { BookRepositoryStub } from '@test/usecases/stubs/bookRepositoryStub'
import { ServerError } from '@/controllers/error/serverError'
import { BookAlreadyExistsError } from '@/usecases/error'

type SutTypes = {
  sut: BookController
  createBook: CreateBook
  listBooks: ListBooks
}

const makeSut = (): SutTypes => {
  const bookRepository = new BookRepositoryStub()
  const createBook: CreateBook = new CreateBook(bookRepository)
  const listBooks: ListBooks = new ListBooks(bookRepository)
  const sut = new BookController(createBook, listBooks)
  return {
    sut,
    createBook,
    listBooks
  }
}

describe('BookController', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  describe('create', () => {
    it('should call CreateBook with correct parameters', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          id: 'fake_id',
          title: 'Fake Title',
          author: 'Fake Author',
          createdAt: new Date(),
          finishedAt: new Date(),
          grade: 5,
          status: 'Read'
        }
      }

      const httpResponse = await sut.create(httpRequest)

      expect(httpResponse.body).toEqual(httpRequest.body)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.created.code)
    })

    it('should return a server error if usecase throws', async () => {
      const { sut, createBook } = makeSut()
      jest.spyOn(createBook, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))

      const httpRequest = {
        body: {
          id: 'fake_id',
          title: 'Fake Title',
          author: 'Fake Author',
          createdAt: new Date(),
          finishedAt: new Date(),
          grade: 5,
          status: 'Read'
        }
      }
      const httpResponse = await sut.create(httpRequest)

      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
      expect(httpResponse.body).toEqual('Internal Server Error')
    })

    it('should return a bad request if title already exists', async () => {
      const { sut, createBook } = makeSut()
      jest.spyOn(createBook, 'execute').mockReturnValueOnce(Promise.reject(
        new BookAlreadyExistsError('Book already exists')
      ))

      const httpRequest = {
        body: {
          id: 'fake_id',
          title: 'Fake Title',
          author: 'Fake Author',
          createdAt: new Date(),
          finishedAt: new Date(),
          grade: 5,
          status: 'Read'
        }
      }
      const httpResponse = await sut.create(httpRequest)

      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('Book already exists')
    })
  })

  describe('index', () => {
    it('should call ListBooks with correct parameters', async () => {
      const { sut, listBooks } = makeSut()
      jest.spyOn(listBooks, 'execute').mockReturnValueOnce(Promise.resolve([
        {
          id: 'fake_id',
          title: 'Fake Title',
          author: 'Fake Author',
          createdAt: new Date(),
          finishedAt: new Date(),
          grade: 5,
          status: 'Read'
        },
        {
          id: 'fake_id_2',
          title: 'Fake Title 2',
          author: 'Fake Author 2',
          createdAt: new Date(),
          status: 'Wanna read'
        }
      ]))
      const response = await sut.index()
      expect(response.httpStatusCode).toEqual(HttpStatusCodes.ok.code)
      expect(response.body[0].id).toEqual('fake_id')
    })

    it('should return a server error if usecase throws', async () => {
      const { sut, listBooks } = makeSut()
      jest.spyOn(listBooks, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))

      const httpResponse = await sut.index()

      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
      expect(httpResponse.body).toEqual('Internal Server Error')
    })
  })
})
