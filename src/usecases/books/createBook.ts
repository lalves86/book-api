import { Book } from '@/domain/book'
import { BookRepository } from '@/repositories/ports/bookRepository'
import { UseCase } from '../ports/usecase'

export class CreateBook implements UseCase<Book> {
  constructor (
    private readonly bookRepository: BookRepository
  ) {}

  async execute (book: Book): Promise<Book> {
    return await this.bookRepository.create(book)
  }
}
