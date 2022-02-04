import { Book } from '@/domain/book'
import { CreateBook } from '@/usecases/books/createBook'
class BookRepositoryStub {
  async create (book: Book): Promise<Book> {
    return Promise.resolve({
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    })
  }
}

const makeSut = (): CreateBook => {
  const bookRepositoryStub = new BookRepositoryStub()
  return new CreateBook(bookRepositoryStub)
}

describe('CreateBook', () => {
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
