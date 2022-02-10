import { Book } from '@/domain/book'
import { BookRepository } from '@/repositories/ports/bookRepository'
import { UseCase } from '../ports/usecase'

export class ListBookById implements UseCase<Book> {
  constructor (
    private readonly bookRepository: BookRepository
  ) {}

  async execute (id: string): Promise<Book> {
    return await this.bookRepository.listById(id)
  }
}
