import { Book } from '@/domain/book'
import { CreateBookRepository } from '@/repositories/ports/createBookRepository'
import { UseCase } from '../ports/usecase'

export class CreateBook implements UseCase<Book> {
  constructor (
    private readonly createBookRepository: CreateBookRepository
  ) {}

  async execute (book: Book): Promise<Book> {
    return await this.createBookRepository.create(book)
  }
}
