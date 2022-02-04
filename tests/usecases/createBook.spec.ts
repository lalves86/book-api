import { Book } from '@/domain/book'
import { CreateBook } from '@/usecases/createBook'

describe('CreateBook', () => {
  it('should call book repository with correct parameters', async () => {
    const fakeBook: Book = {
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    }

    class BookRepositoryStub {
      async create (book: Book): Promise<Book> {
        return Promise.resolve(fakeBook)
      }
    }

    const createBookUsecase = new CreateBook(new BookRepositoryStub())
    const result = await createBookUsecase.execute(fakeBook)

    expect(result).toEqual(fakeBook)
  })
})
