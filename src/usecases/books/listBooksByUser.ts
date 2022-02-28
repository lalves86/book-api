import { Book } from '@/domain/book'
import { BookRepository } from '../ports/repositories'
import { UseCase } from '../ports/usecase'

export class ListBooksByUser implements UseCase<Book[]> {
  constructor (
    private readonly booksRepository: BookRepository
  ) {}

  async execute (userId: string): Promise<Book[]> {
    const booksByUser = await this.booksRepository.listByUserId(userId)

    return booksByUser
  }
}
