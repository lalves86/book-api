import { Book } from '@/domain/book'
import { BookRepository } from '@/usecases/ports/repositories/bookRepository'
import { CreateBookDto } from '../dtos/books/createBookDto'
import { BookAlreadyExistsError, InvalidDataError } from '../error/books'
import { UseCase } from '../ports/usecase'

export class CreateBook implements UseCase<Book> {
  constructor (
    private readonly bookRepository: BookRepository
  ) {}

  async execute (book: CreateBookDto): Promise<Book> {
    const bookExists = await this.bookRepository.listByTitleAndUserId(book.title, book.userId)
    if (bookExists) {
      throw new BookAlreadyExistsError('Book already exists')
    }
    if (book.status !== 'Read' && book.grade) {
      throw new InvalidDataError('You can only grade finished books')
    }
    if (book.status === 'Read' && !book.finishedAt) {
      throw new InvalidDataError('Date is mandatory when status is Read')
    }
    const newBook = await this.bookRepository.create(book)
    return newBook
  }
}
