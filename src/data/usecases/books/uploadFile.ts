import { UploadImageDto } from '@/data/dtos/books'
import { BookNotFoundError } from '@/data/error/books'
import { BookRepository } from '@/data/ports/repositories'
import { UseCase } from '@/data/ports/usecase'
import { Book } from '@/domain/book'

export class UploadFile implements UseCase<any> {
  constructor (
    private readonly booksRepository: BookRepository
  ) {}

  async execute (input: UploadImageDto): Promise<Book> {
    const book = await this.booksRepository.listById(input.id)
    if (!book) {
      throw new BookNotFoundError('Book not found')
    }
    book.imageUrl = input.imageUrl
    const response = await this.booksRepository.update(book)
    return response
  }
}
