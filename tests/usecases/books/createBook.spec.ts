import Mockdate from 'mockdate'
import { Book } from '@/domain/book'
import { CreateBook } from '@/usecases/books/createBook'
import { BookRepositoryStub } from '../stubs/bookRepositoryStub'

const makeSut = (): CreateBook => {
  const bookRepositoryStub = new BookRepositoryStub()
  return new CreateBook(bookRepositoryStub)
}

describe('CreateBook', () => {
  beforeAll(() => {
    Mockdate.set(new Date())
  })

  afterAll(() => {
    Mockdate.reset()
  })

  it('should call book repository with correct parameters', async () => {
    const createBookUsecase = makeSut()

    const fakeBook: Book = {
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    }
    const result = await createBookUsecase.execute(fakeBook)

    expect(result).toEqual(fakeBook)
  })
})
