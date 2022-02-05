import { Book } from '@/domain/book'

export class BookRepositoryStub {
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

  async list (): Promise<Book[]> {
    return Promise.resolve([
      {
        title: 'Fake Title 1',
        author: 'Fake Author 1',
        createdAt: new Date(),
        finishedAt: new Date(),
        grade: 5,
        status: 'Read'
      },
      {
        title: 'Fake Title 2',
        author: 'Fake Author 2',
        createdAt: new Date(),
        status: 'Reading'
      },
      {
        title: 'Fake Title 3',
        author: 'Fake Author 23',
        createdAt: new Date(),
        status: 'Wanna read'
      }
    ])
  }

  async getByTitle (title: string): Promise<Book> {
    return Promise.resolve(null)
  }
}
