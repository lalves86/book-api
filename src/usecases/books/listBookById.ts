import { Book } from '@/domain/book'
import { BookRepository } from '@/repositories/ports/bookRepository'
import { BookNotFoundError } from '../error'
import { UseCase } from '../ports/usecase'

export class ListBookById implements UseCase<Book> {
  constructor (
    private readonly bookRepository: BookRepository
  ) {}

  async execute (id: string): Promise<Book> {
    const book = await this.bookRepository.listById(id)
    if (!book) {
      throw new BookNotFoundError('Book id not found')
    }
    return book
  }
}