import Mockdate from 'mockdate'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { BookNotFoundError, InvalidDataError } from '@/usecases/error'
import { UpdateBook } from '@/usecases/books'
import { Book } from '@/domain/book'

type sutTypes = {
  sut: UpdateBook
  bookRepositoryStub: BookRepositoryStub
}

const makeSut = (): sutTypes => {
  const bookRepositoryStub = new BookRepositoryStub()
  const sut = new UpdateBook(bookRepositoryStub)
  return {
    sut,
    bookRepositoryStub
  }
}

describe('UpdateBook', () => {
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

  it('should throw BookNotFoundError if id is not found', async () => {
    const { sut, bookRepositoryStub } = makeSut()
    jest.spyOn(bookRepositoryStub, 'listById').mockReturnValueOnce(Promise.resolve(null))

    const promise = sut.execute({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    })

    await expect(promise).rejects.toThrow(BookNotFoundError)
  })

  it('should throw InvalidDataError grade is passed before finished reading', async () => {
    const { sut, bookRepositoryStub } = makeSut()
    const fakeBook: Book = {
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      status: 'Wanna read'
    }

    jest.spyOn(bookRepositoryStub, 'listById').mockReturnValueOnce(Promise.resolve(fakeBook))

    const promise = sut.execute({ ...fakeBook, grade: 5 })

    await expect(promise).rejects.toThrow(InvalidDataError)
  })
})
