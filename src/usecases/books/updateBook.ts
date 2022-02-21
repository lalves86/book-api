import { Book } from '@/domain/book'
import { BookRepository } from '@/infra/repositories/ports/bookRepository'
import { UpdateBookDto } from '../dtos/books'
import { BookNotFoundError, InvalidDataError } from '../error/books'
import { UseCase } from '../ports/usecase'

export class UpdateBook implements UseCase<Book> {
  constructor (
    private readonly bookRepository: BookRepository
  ) {}

  async execute (data: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.listById(data.id)
    if (!book) {
      throw new BookNotFoundError('Book id not found')
    }
    if ((book.status !== 'Read' || data.status !== 'Read') && data.grade) {
      throw new InvalidDataError('You can only grade finished books')
    }
    if (data.status === 'Read' && !data.finishedAt) {
      throw new InvalidDataError('Date is mandatory when status is Read')
    }
    await this.bookRepository.update(data)
    return book
  }
}
