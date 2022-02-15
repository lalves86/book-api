import { Book } from '@/domain/book'
import { BookRepository } from '@/repositories/ports/bookRepository'
import { CreateBookDto } from '../dtos/createBookDto'
import { BookAlreadyExistsError } from '../error'
import { UseCase } from '../ports/usecase'

export class CreateBook implements UseCase<Book> {
  constructor (
    private readonly bookRepository: BookRepository
  ) {}

  async execute (book: CreateBookDto): Promise<Book> {
    const bookExists = await this.bookRepository.getByTitle(book.title)
    if (bookExists) {
      throw new BookAlreadyExistsError('Book already exists')
    }

    return await this.bookRepository.create(bookExists)
  }
}
