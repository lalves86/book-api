import { Book } from '@/domain/book'

export class BookRepositoryStub {
  async create (book: Book): Promise<Book> {
    return Promise.resolve({
      id: 'fake_id',
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
        id: 'fake_id_1',
        title: 'Fake Title 1',
        author: 'Fake Author 1',
        createdAt: new Date(),
        finishedAt: new Date(),
        grade: 5,
        status: 'Read'
      },
      {
        id: 'fake_id_2',
        title: 'Fake Title 2',
        author: 'Fake Author 2',
        createdAt: new Date(),
        status: 'Reading'
      },
      {
        id: 'fake_id+3',
        title: 'Fake Title 3',
        author: 'Fake Author 3',
        createdAt: new Date(),
        status: 'Wanna read'
      }
    ])
  }

  async listById (id: string): Promise<Book> {
    return Promise.resolve({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    })
  }

  async getByTitle (title: string): Promise<Book> {
    return Promise.resolve(null)
  }

  async update (book: Book): Promise<Book> {
    return Promise.resolve({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read'
    })
  }

  async delete (id: string): Promise<void> {
    return Promise.resolve()
  }
}
