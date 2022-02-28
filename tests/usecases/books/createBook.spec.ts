import Mockdate from 'mockdate'
import { CreateBook } from '@/usecases/books'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'
import { BookAlreadyExistsError, InvalidDataError } from '@/usecases/error/books'
import { CreateBookDto } from '@/usecases/dtos/books/createBookDto'

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

    const fakeBook: CreateBookDto = {
      title: 'Fake Title',
      author: 'Fake Author',
      finishedAt: new Date(),
      grade: 5,
      status: 'Read',
      userId: 'fake_user_id'
    }
    const result = await sut.execute(fakeBook)

    expect(result.id).toBeDefined()
    expect(result.title).toBe(fakeBook.title)
    expect(result.author).toBe(fakeBook.author)
    expect(result.createdAt).toBeDefined()
  })

  it('should not allow to add 2 books with the same title and the same userId', async () => {
    const { sut, bookRepositoryStub } = makeSut()
    const fakeBook: CreateBookDto = {
      title: 'Fake Title',
      author: 'Fake Author',
      finishedAt: new Date(),
      grade: 5,
      status: 'Read',
      userId: 'fake_user_id'
    }
    jest.spyOn(bookRepositoryStub, 'listByTitleAndUserId').mockReturnValueOnce(Promise.resolve({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read',
      userId: 'fake_user_id'
    }))
    const promise = sut.execute(fakeBook)

    await expect(promise).rejects.toThrow(BookAlreadyExistsError)
  })

  it('should allow to add 2 books with the same title by different users', async () => {
    const { sut } = makeSut()
    const fakeBook: CreateBookDto = {
      title: 'Fake Title',
      author: 'Fake Author',
      finishedAt: new Date(),
      grade: 5,
      status: 'Read',
      userId: 'fake_user_id'
    }

    const result = await sut.execute(fakeBook)

    expect(result.id).toBeDefined()
    expect(result.title).toBe(fakeBook.title)
    expect(result.author).toBe(fakeBook.author)
    expect(result.createdAt).toBeDefined()
  })

  it('should not allow to grade unfinished books', async () => {
    const { sut } = makeSut()
    const fakeBook: CreateBookDto = {
      title: 'Fake Title',
      author: 'Fake Author',
      grade: 5,
      status: 'Wanna read',
      userId: 'fake_user_id'
    }
    const promise = sut.execute(fakeBook)

    await expect(promise).rejects.toThrow(InvalidDataError)
  })

  it('should not allow change status to Read without a finishedAt date', async () => {
    const { sut } = makeSut()
    const fakeBook: CreateBookDto = {
      title: 'Fake Title',
      author: 'Fake Author',
      grade: 5,
      status: 'Read',
      userId: 'fake_user_id'
    }
    const promise = sut.execute(fakeBook)

    await expect(promise).rejects.toThrow(InvalidDataError)
  })
})
