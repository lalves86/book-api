import Mockdate from 'mockdate'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { BookNotFoundError, InvalidDataError } from '@/usecases/error/books'
import { UpdateBook } from '@/usecases/books'
import { UpdateBookDto } from '@/usecases/dtos/books'

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

    const fakeBook: UpdateBookDto = {
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    }

    const result = await sut.execute(fakeBook)

    expect(result.id).toEqual(fakeBook.id)
    expect(result.title).toEqual(fakeBook.title)
    expect(result.author).toEqual(fakeBook.author)
    expect(result.createdAt).toBeDefined()
  })

  it('should throw BookNotFoundError if id is not found', async () => {
    const { sut, bookRepositoryStub } = makeSut()
    jest.spyOn(bookRepositoryStub, 'listById').mockReturnValueOnce(Promise.resolve(null))

    const promise = sut.execute({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    })

    await expect(promise).rejects.toThrow(BookNotFoundError)
  })

  it('should throw InvalidDataError grade is passed before finished reading', async () => {
    const { sut, bookRepositoryStub } = makeSut()
    const fakeBook: UpdateBookDto = {
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      status: 'Wanna read'
    }

    jest.spyOn(bookRepositoryStub, 'listById').mockReturnValueOnce(Promise.resolve({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: null,
      grade: null,
      status: 'Wanna read',
      userId: 'fake_user_id'
    }))

    const promise = sut.execute({ ...fakeBook, grade: 5 })

    await expect(promise).rejects.toThrow(InvalidDataError)
  })

  it('should throw InvalidDataError if status is Read without finishedAt date', async () => {
    const { sut, bookRepositoryStub } = makeSut()
    const fakeBook: UpdateBookDto = {
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      status: 'Read'
    }

    jest.spyOn(bookRepositoryStub, 'listById').mockReturnValueOnce(Promise.resolve({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: null,
      grade: null,
      status: 'Wanna read',
      userId: 'fake_user_id'
    }))

    const promise = sut.execute(fakeBook)

    await expect(promise).rejects.toThrow(InvalidDataError)
  })
})
