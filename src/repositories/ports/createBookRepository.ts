import { Book } from '../../domain/book'

export interface CreateBookRepository {
  create (book: Book): Promise<Book>
}
