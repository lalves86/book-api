import Mockdate from 'mockdate'
import { BookController } from '@/controllers/bookController'
import { HttpStatusCodes } from '@/controllers/types/http'
import { CreateBook, DeleteBook, ListBookById, ListBooks, UpdateBook, ListBooksByUser } from '@/usecases/books'
import { BookRepositoryStub } from '@test/usecases/stubs/bookRepositoryStub'
import { ServerError } from '@/controllers/error/serverError'
import { BookAlreadyExistsError, BookNotFoundError, InvalidDataError } from '@/usecases/error/books'

type SutTypes = {
  sut: BookController
  createBook: CreateBook
  listBooks: ListBooks
  listBookById: ListBookById
  updateBook: UpdateBook,
  deleteBook: DeleteBook,
  listBooksByUser: ListBooksByUser
}

const makeSut = (): SutTypes => {
  const bookRepository = new BookRepositoryStub()
  const createBook: CreateBook = new CreateBook(bookRepository)
  const listBooks: ListBooks = new ListBooks(bookRepository)
  const listBookById: ListBookById = new ListBookById(bookRepository)
  const updateBook: UpdateBook = new UpdateBook(bookRepository)
  const deleteBook: DeleteBook = new DeleteBook(bookRepository)
  const listBooksByUser = new ListBooksByUser(bookRepository)
  const sut = new BookController(
    createBook,
    listBooks,
    listBookById,
    updateBook,
    deleteBook,
    listBooksByUser
  )
  return {
    sut,
    createBook,
    listBooks,
    listBookById,
    updateBook,
    deleteBook,
    listBooksByUser
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
          title: 'Fake Title',
          author: 'Fake Author',
          finishedAt: new Date(),
          grade: 5,
          status: 'Read'
        }
      }

      const httpResponse = await sut.create(httpRequest)

      expect(httpResponse.body.title).toEqual(httpRequest.body.title)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.created.code)
    })

    it('should return a server error if usecase throws', async () => {
      const { sut, createBook } = makeSut()
      jest.spyOn(createBook, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))

      const httpRequest = {
        body: {
          title: 'Fake Title',
          author: 'Fake Author',
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
          title: 'Fake Title',
          author: 'Fake Author',
          finishedAt: new Date(),
          grade: 5,
          status: 'Read'
        }
      }
      const httpResponse = await sut.create(httpRequest)

      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('Book already exists')
    })

    it('should return a bad request if mandatory fields are not passed', async () => {
      const { sut } = makeSut()

      const httpRequest = {
        body: {
          author: 'Fake Author',
          createdAt: new Date(),
          status: 'Read'
        }
      }
      const httpResponse = await sut.create(httpRequest)

      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('Missing fields')
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
          status: 'Read',
          userId: 'fake_user_id'
        },
        {
          id: 'fake_id_2',
          title: 'Fake Title 2',
          author: 'Fake Author 2',
          createdAt: new Date(),
          status: 'Wanna read',
          userId: 'fake_user_id'
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

  describe('show', () => {
    it('should call ListBookById with correct parameters', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        params: {
          id: 'fake_id'
        }
      }
      const httpResponse = await sut.show(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.ok.code)
      expect(httpResponse.body.title).toEqual('Fake Title')
    })

    it('should throw server error if usecase throws', async () => {
      const { sut, listBookById } = makeSut()
      jest.spyOn(listBookById, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))
      const httpRequest = {
        params: {
          id: 'fake_id'
        }
      }
      const httpResponse = await sut.show(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
      expect(httpResponse.body).toEqual('Internal Server Error')
    })

    it('should return a bad request if book id is not found', async () => {
      const { sut, listBookById } = makeSut()
      jest.spyOn(listBookById, 'execute').mockReturnValueOnce(Promise.reject(new BookNotFoundError('Book id not found')))
      const httpRequest = {
        params: {
          id: 'fake_id'
        }
      }
      const httpResponse = await sut.show(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('Book id not found')
    })
  })

  describe('update', () => {
    it('should call updateBook with correct parameters', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        params: {
          id: 'fake_id'
        },
        body: {
          title: 'Fake Title',
          author: 'Fake Author',
          finishedAt: new Date(),
          grade: 5,
          status: 'Read'
        }
      }
      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.ok.code)
      expect(httpResponse.body.title).toEqual('Fake Title')
    })

    it('should throw server error if usecase throws', async () => {
      const { sut, updateBook } = makeSut()
      jest.spyOn(updateBook, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))
      const httpRequest = {
        params: {
          id: 'fake_id'
        },
        body: {
          title: 'Fake Title',
          author: 'Fake Author',
          status: 'Reading'
        }
      }
      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
      expect(httpResponse.body).toEqual('Internal Server Error')
    })

    it('should return a bad request if book id is not found', async () => {
      const { sut, updateBook } = makeSut()
      jest.spyOn(updateBook, 'execute').mockReturnValueOnce(Promise.reject(new BookNotFoundError('Book id not found')))
      const httpRequest = {
        params: {
          id: 'fake_id'
        },
        body: {
          title: 'Fake Title',
          author: 'Fake Author',
          status: 'Reading'
        }
      }
      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('Book id not found')
    })

    it('should return a bad request if a mandatory param is missing', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        params: {
          id: 'fake_id'
        },
        body: {
          author: 'Fake Author',
          status: 'Reading'
        }
      }
      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('Missing fields')
    })

    it('should return a bad request when trying to update params not allowed', async () => {
      const { sut, updateBook } = makeSut()
      jest.spyOn(updateBook, 'execute').mockReturnValueOnce(Promise.reject(new InvalidDataError('You can only grade finished books')))
      const httpRequest = {
        params: {
          id: 'fake_id'
        },
        body: {
          title: 'Fake Title',
          author: 'Fake Author',
          status: 'Reading',
          grade: 5
        }
      }
      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('You can only grade finished books')
    })

    it('should return a bad request when trying to update book status without a finishedAt date', async () => {
      const { sut, updateBook } = makeSut()
      jest.spyOn(updateBook, 'execute').mockReturnValueOnce(Promise.reject(new InvalidDataError('Date is mandatory when status is Read')))
      const httpRequest = {
        params: {
          id: 'fake_id'
        },
        body: {
          title: 'Fake Title',
          author: 'Fake Author',
          status: 'Read',
          grade: 5
        }
      }
      const httpResponse = await sut.update(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('Date is mandatory when status is Read')
    })
  })

  describe('delete', () => {
    it('should call deleteBook with correct params', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        params: {
          id: 'fake_id'
        }
      }
      const httpResponse = await sut.delete(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(200)
      expect(httpResponse.body).toEqual('Book with id fake_id deleted')
    })

    it('should throw server error if usecase throws', async () => {
      const { sut, deleteBook } = makeSut()
      jest.spyOn(deleteBook, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))
      const httpRequest = {
        params: {
          id: 'fake_id'
        },
        body: {
          title: 'Fake Title',
          author: 'Fake Author',
          status: 'Reading'
        }
      }
      const httpResponse = await sut.delete(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
      expect(httpResponse.body).toEqual('Internal Server Error')
    })

    it('should return a bad request if book id is not found', async () => {
      const { sut, deleteBook } = makeSut()
      jest.spyOn(deleteBook, 'execute').mockReturnValueOnce(Promise.reject(new BookNotFoundError('Book id not found')))
      const httpRequest = {
        params: {
          id: 'fake_id'
        },
        body: {
          title: 'Fake Title',
          author: 'Fake Author',
          status: 'Reading'
        }
      }
      const httpResponse = await sut.delete(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.badRequest.code)
      expect(httpResponse.body.message).toEqual('Book id not found')
    })
  })

  describe('booksByUser', () => {
    it('should call listBooksByUser with correct params', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        userId: 'fake_user_id'
      }

      const httpResponse = await sut.booksByUser(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.ok.code)
      expect(httpResponse.body[0].id).toEqual('fake_id_1')
    })

    it('should throw server error if usecase throws', async () => {
      const { sut, listBooksByUser } = makeSut()
      jest.spyOn(listBooksByUser, 'execute').mockReturnValueOnce(Promise.reject(new ServerError('Internal Server Error')))
      const httpRequest = {
        userId: 'fake_user_id'
      }

      const httpResponse = await sut.booksByUser(httpRequest)
      expect(httpResponse.httpStatusCode).toEqual(HttpStatusCodes.serverError.code)
      expect(httpResponse.body).toEqual('Internal Server Error')
    })
  })
})
