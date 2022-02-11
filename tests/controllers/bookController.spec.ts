import Mockdate from 'mockdate'
import { BookController } from '@/controllers/bookController'
import { HttpRequest, HttpResponse } from '@/controllers/types/http'
import { CreateBook } from '@/usecases/books'
import { BookRepositoryStub } from '@test/usecases/stubs/bookRepositoryStub'

describe('BookController', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call CreateBook with correct parameters', async () => {
    const bookRepository = new BookRepositoryStub()
    const createBook: CreateBook = new CreateBook(bookRepository)
    const sut = new BookController(createBook)

    const httpRequest: HttpRequest = {
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

    const httpResponse: HttpResponse = await sut.create(httpRequest)

    expect(httpResponse.body).toEqual(httpRequest.body)
    expect(httpResponse.httpStatusCode).toEqual(201)
  })
})
