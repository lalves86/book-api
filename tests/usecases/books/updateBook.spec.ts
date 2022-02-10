import Mockdate from 'mockdate'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { BookNotFoundError } from '@/usecases/error'
import { UpdateBook } from '@/usecases/books'
import { Book } from '@/domain/book'

const makeSut = (): UpdateBook => {
  const bookRepositoryStub = new BookRepositoryStub()
  return new UpdateBook(bookRepositoryStub)
}

describe('UpdateBook', () => {
  const fakeBook: Book = {
    id: 'fake_id',
    title: 'Fake Title',
    author: 'Fake Author',
    createdAt: new Date(),
    finishedAt: new Date(),
    grade: 5,
    status: 'Read'
  }

  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call book repository with correct parameters', async () => {
    const sut = makeSut()

    const result = await sut.execute(fakeBook)

    expect(result).toEqual(fakeBook)
  })

  it('should throw BookNotFoundError if id is not found', async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'execute').mockReturnValueOnce(
      Promise.reject(new BookNotFoundError('Book id not found'))
    )

    const promise = sut.execute(fakeBook)

    await expect(promise).rejects.toThrow(BookNotFoundError)
  })
})
