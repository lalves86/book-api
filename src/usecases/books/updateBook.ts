import { Book } from '@/domain/book'
import { BookRepository } from '@/repositories/ports/bookRepository'
import { BookNotFoundError, InvalidDataError } from '../error'
import { UseCase } from '../ports/usecase'

export class UpdateBook implements UseCase<Book> {
  constructor (
    private readonly bookRepository: BookRepository
  ) {}

  async execute (data: Book): Promise<Book> {
    const book = await this.bookRepository.listById(data.id)
    if (!book) {
      throw new BookNotFoundError('Book id not found')
    }
    if ((book.status !== 'Read' || data.status !== 'Read') && data.grade) {
      throw new InvalidDataError('You can only grade finished books')
    }
    await this.bookRepository.update(data)
    return book
  }
}
