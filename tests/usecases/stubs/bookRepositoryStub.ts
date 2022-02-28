import { Book } from '@/domain/book'
import { BookRepository } from '@/usecases/ports/repositories/bookRepository'
import { CreateBookDto } from '@/usecases/dtos/books'

export class BookRepositoryStub implements BookRepository {
  async create (book: CreateBookDto): Promise<Book> {
    return Promise.resolve({
      id: 'fake_id',
      title: 'Fake Title',
      author: 'Fake Author',
      createdAt: new Date(),
      finishedAt: new Date(),
      grade: 5,
      status: 'Read',
      userId: 'fake_user_id'
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
        status: 'Read',
        userId: 'fake_user_id'
      },
      {
        id: 'fake_id_2',
        title: 'Fake Title 2',
        author: 'Fake Author 2',
        createdAt: new Date(),
        status: 'Reading',
        userId: 'fake_user_id'
      },
      {
        id: 'fake_id+3',
        title: 'Fake Title 3',
        author: 'Fake Author 3',
        createdAt: new Date(),
        status: 'Wanna read',
        userId: 'fake_user_id'
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
      status: 'Read',
      userId: 'fake_user_id'
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
      status: 'Read',
      userId: 'fake_user_id'
    })
  }

  async delete (id: string): Promise<string> {
    return Promise.resolve('Book with id fake_id deleted')
  }

  async listByUserId (userId: string): Promise<Book[]> {
    return Promise.resolve([
      {
        id: 'fake_id_1',
        title: 'Fake Title 1',
        author: 'Fake Author 1',
        createdAt: new Date(),
        finishedAt: new Date(),
        grade: 5,
        status: 'Read',
        userId: 'fake_user_id'
      },
      {
        id: 'fake_id_2',
        title: 'Fake Title 2',
        author: 'Fake Author 2',
        createdAt: new Date(),
        status: 'Reading',
        userId: 'fake_user_id'
      },
      {
        id: 'fake_id+3',
        title: 'Fake Title 3',
        author: 'Fake Author 3',
        createdAt: new Date(),
        status: 'Wanna read',
        userId: 'fake_user_id'
      }
    ])
  }
}
