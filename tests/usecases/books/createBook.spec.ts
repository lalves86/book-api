import Mockdate from 'mockdate'
import { Book } from '@/domain/book'
import { CreateBook } from '@/usecases/books'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { BookAlreadyExistsError } from '@/usecases/error'

type sutTypes = {
  sut: CreateBook
  bookRepositoryStub: BookRepositoryStub
}

const makeSut = (): sutTypes => {
  const bookRepositoryStub = new BookRepositoryStub()
  const sut = new CreateBook(bookRepositoryStub)
  return {
    sut,
    bookRepositoryStub
  }
}

describe('CreateBook', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call book repository with correct parameters', async () => {
    const { sut } = makeSut()

    const fakeBook: Book = {
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    }
    const result = await sut.execute(fakeBook)

    expect(result).toEqual(fakeBook)
  })

  it('should not allow to add 2 books with the same title', async () => {
    const { sut, bookRepositoryStub } = makeSut()
    const fakeBook: Book = {
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    }
    jest.spyOn(bookRepositoryStub, 'getByTitle').mockReturnValueOnce(Promise.resolve(fakeBook))
    const promise = sut.execute(fakeBook)

    await expect(promise).rejects.toThrow(BookAlreadyExistsError)
  })
})
